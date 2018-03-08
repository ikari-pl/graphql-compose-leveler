"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_compose_1 = require("graphql-compose");
const _ = require("lodash");
// graphql-leveler implementation for graphql-compose
function levelerize(tc, levelerVisited) {
    const fieldNames = tc.getFieldNames();
    if (levelerVisited.has(tc.getTypeName())) {
        return;
    }
    levelerVisited.add(tc.getTypeName());
    for (const fieldName of fieldNames) {
        const fieldType = tc.getFieldType(fieldName);
        if (fieldType instanceof graphql_1.GraphQLObjectType ||
            (fieldType instanceof graphql_1.GraphQLList && fieldType.ofType instanceof graphql_1.GraphQLObjectType)) {
            const fieldTC = tc.getFieldTC(fieldName);
            levelerize(tc.getFieldTC(fieldName), levelerVisited);
            fieldTC.addFields({
                _get: {
                    type: "JSON",
                    args: {
                        path: "String!",
                        defaultValue: "JSON",
                        allowUndefined: "Boolean"
                    },
                    resolve: (obj, { path, defaultValue, allowUndefined = false }) => {
                        const val = _.get(obj, path, defaultValue);
                        if (!allowUndefined && typeof val === "undefined") {
                            throw new Error(`The "${path}" property does not exist.`);
                        }
                        return val;
                    }
                },
                // bonus feature
                _pluck: {
                    type: new graphql_1.GraphQLList(graphql_compose_1.GraphQLJSON),
                    args: {
                        list: "String!",
                        path: "String!",
                        allowUndefined: "Boolean"
                    },
                    resolve: (obj, { list, path, allowUndefined = false }) => {
                        const theList = _.get(obj, list, []);
                        if (!allowUndefined && typeof theList === "undefined") {
                            throw new Error(`The "${list}" list does not exist.`);
                        }
                        const val = _.map(theList, path);
                        if (!allowUndefined && typeof val === "undefined") {
                            throw new Error(`The "${path}" path within list does not exist.`);
                        }
                        return val;
                    }
                },
                _root: {
                    type: fieldTC.getType(),
                    resolve: obj => obj
                }
            });
        }
    }
}
function default_1(tc) {
    levelerize(tc, new Set());
}
exports.default = default_1;
//# sourceMappingURL=lib.js.map