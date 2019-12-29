import gql from "graphql-tag";

export const QueryStockUnit = gql`
  query StockUnit(
    $where: StockUnitWhereUniqueInput!
    $componentInventoryUnitStockUnitInventoryUnitWhere: InventoryUnitWhereInput
    $componentInventoryUnitStockUnitInventoryUnitOrderBy: InventoryUnitOrderByInput
    $componentInventoryUnitStockUnitInventoryUnitFirst: Int,
  	$inventoryUnitsOrderBy: InventoryUnitOrderByInput,
  	$inventoryUnitsWhere: InventoryUnitWhereInput
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
        formula
        createdAt
        currency {
          symbol
        }
      }
      inventoryUnits (
        orderBy: $inventoryUnitsOrderBy,
        where: $inventoryUnitsWhere
      ) {
        id
        quantity
        formula
        expiresAt
        createdAt
        inventory {
          id
          createdAt
        }
        expenseUnit {
          amount
          formula
          currency {
            symbol
          }
        }
        inventory {
          id
          createdAt
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
          formula
          expiresAt
          expenseUnit {
            amount
            formula
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
              formula
              expiresAt
              createdAt
              unit {
                symbol
              }
              expenseUnit {
                amount
                formula
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
