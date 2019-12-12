import gql from "graphql-tag";

export const QueryStockUnit = gql`
  query StockUnit(
    $where: StockUnitWhereUniqueInput!
    $componentInventoryUnitStockUnitInventoryUnitWhere: InventoryUnitWhereInput
    $componentInventoryUnitStockUnitInventoryUnitOrderBy: InventoryUnitOrderByInput
    $componentInventoryUnitStockUnitInventoryUnitFirst: Int
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
      inventoryUnits {
        id
        quantity
        expiresAt
        createdAt
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
