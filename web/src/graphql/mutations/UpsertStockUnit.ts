import gql from "graphql-tag";

export const UpsertStockUnit = gql`
  mutation UpsertStockUnit ($where: StockUnitWhereUniqueInput!, $create: StockUnitCreateInput!, $update: StockUnitUpdateInput!) {
  upsertStockUnit (where: $where, create: $create, update: $update) {
    id
    name
  }
}
`;
