import gql from "graphql-tag";

export const QueryInventory = gql`
  query Inventory($where: InventoryWhereUniqueInput!, $inventoryUnitsOrderBy: InventoryUnitOrderByInput) {
    inventory(where: $where) {
      id
      createdAt
      inventoryUnits (orderBy: $inventoryUnitsOrderBy) {
        id
        expiresAt
        expenseUnit {
          amount
          currency {
            symbol
          }
        }
        quantity
        unit {
          symbol
        }
        stockUnit {
          id
          name
        }
      }
    }
  }
`;
