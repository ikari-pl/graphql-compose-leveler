import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";
import { AnyScalar } from "graphql-anyscalar";
import { ComposeStorage, TypeComposer } from "graphql-compose";
import * as _ from "lodash";

// graphql-leveler implementation for graphql-compose
function levelerize(tc: TypeComposer, levelerVisited: Set<string>) {
  const fieldNames = tc.getFieldNames();
  if (levelerVisited.has(tc.getTypeName())) {
    return;
  }
  levelerVisited.add(tc.getTypeName());
  for (const fieldName of fieldNames) {
    const fieldType = tc.getFieldType(fieldName);
    if (
      fieldType instanceof GraphQLObjectType ||
      (fieldType instanceof GraphQLList && fieldType.ofType instanceof GraphQLObjectType)
    ) {
      const fieldTC = tc.getFieldTC(fieldName);
      levelerize(tc.getFieldTC(fieldName), levelerVisited);
      fieldTC.addFields({
        _get: {
          type: AnyScalar,
          args: {
            path: { type: new GraphQLNonNull(GraphQLString) },
            defaultValue: { type: AnyScalar },
            allowUndefined: { type: GraphQLBoolean }
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
          type: new GraphQLList(AnyScalar),
          args: {
            list: { type: new GraphQLNonNull(GraphQLString) },
            path: { type: new GraphQLNonNull(GraphQLString) },
            defaultValue: { type: AnyScalar },
            allowUndefined: { type: GraphQLBoolean }
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

export default function(GQC: ComposeStorage) {
  levelerize(GQC.rootQuery(), new Set<string>());
}
