import gql from "graphql-tag";

export const QueryStockUnit = gql`
  query StockUnit(
    $where: StockUnitWhereUniqueInput!
    $componentInventoryUnitStockUnitInventoryUnitWhere: InventoryUnitWhereInput
    $componentInventoryUnitStockUnitInventoryUnitOrderBy: InventoryUnitOrderByInput
    $componentInventoryUnitStockUnitInventoryUnitFirst: Int,
    $inventoryUnitsOrderBy: InventoryUnitOrderByInput,
    $inventoryUnitWhere: InventoryUnitWhereInput
  ) {
    stockUnit(where: $where) {
      id
      name
      category {
        name
      }
      expenseUnits {
        id
        amount
        createdAt
        currency {
          symbol
        }
      }
      inventoryUnits (
        orderBy: $inventoryUnitsOrderBy,
        where: $inventoryUnitWhere
      ) {
        id
        quantity
        expiresAt
        createdAt
        expenseUnit {
          amount
          currency {
            symbol
          }
        }
        unit {
          name
          symbol
        }
      }
      components {
        id
        stockUnit {
          id
          name
        }
        inventoryUnit {
          quantity
          expiresAt
          expenseUnit {
            amount
            currency {
              symbol
            }
          }
          unit {
            symbol
          }
          stockUnit {
            id
            name
            inventoryUnits(
              orderBy: $componentInventoryUnitStockUnitInventoryUnitOrderBy
              first: $componentInventoryUnitStockUnitInventoryUnitFirst
              where: $componentInventoryUnitStockUnitInventoryUnitWhere
            ) {
              quantity
              expiresAt
              createdAt
              unit {
                symbol
              }
              expenseUnit {
                amount
                currency {
                  symbol
                }
              }
            }
          }
        }
      }
    }
  }
`;
