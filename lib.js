"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_anyscalar_1 = require("graphql-anyscalar");
const _ = require("lodash");
function is(object, instanceOf) {
    return !!(object.constructor && object.constructor.name === instanceOf);
}
// graphql-leveler implementation for graphql-compose
function levelerize(tc, levelerVisited) {
    const fieldNames = tc.getFieldNames();
    if (levelerVisited.has(tc.getTypeName())) {
        return;
    }
    levelerVisited.add(tc.getTypeName());
    for (const fieldName of fieldNames) {
        const fieldType = tc.getFieldType(fieldName);
        if (
        /*
              fieldType instanceof GraphQLObjectType ||
        (fieldType instanceof GraphQLList && fieldType.ofType instanceof GraphQLObjectType)
  
         */
        fieldType instanceof graphql_1.GraphQLObjectType ||
            (fieldType instanceof graphql_1.GraphQLList && fieldType.ofType instanceof graphql_1.GraphQLObjectType)) {
            const fieldTC = tc.getFieldTC(fieldName);
            levelerize(tc.getFieldTC(fieldName), levelerVisited);
            fieldTC.addFields({
                _get: {
                    type: graphql_anyscalar_1.AnyScalar,
                    args: {
                        path: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                        defaultValue: { type: graphql_anyscalar_1.AnyScalar },
                        allowUndefined: { type: graphql_1.GraphQLBoolean }
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
                    type: new graphql_1.GraphQLList(graphql_anyscalar_1.AnyScalar),
                    args: {
                        list: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                        path: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                        defaultValue: { type: graphql_anyscalar_1.AnyScalar },
                        allowUndefined: { type: graphql_1.GraphQLBoolean }
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