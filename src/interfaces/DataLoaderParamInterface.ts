import { GraphQLResolveInfo } from "graphql";

export class DataLoaderParam<T> {

  key: T;
  info: GraphQLResolveInfo
}