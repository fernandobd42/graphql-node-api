import { DbConnection } from "./DBConnectionInterface";
import { AuthUser } from "./AuthUserInterface";
import { DataLoaders } from "./DataLoaderInterface";
import { RequestedFields } from "../graphql/ast/RequestedFields";

export interface ResolverContext {

  db?: DbConnection,
  authorization?: string,
  authUser?: AuthUser,
  dataloaders?: DataLoaders,
  requestedFields?: RequestedFields
}