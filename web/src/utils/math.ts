import * as math from "mathjs";

export const getComponentCostByMeasurementUnit = (component: any) => {
  const componentQuantity = component.inventoryUnit.quantity;
  const componentUnitSymbol = (component.inventoryUnit.unit.symbol as string).toLowerCase();
  const inventoryUnitQuantity = component.inventoryUnit.stockUnit.inventoryUnits[0].quantity;
  const inventoryUnitCost = component.inventoryUnit.stockUnit.inventoryUnits[0].expenseUnit.amount;
  const inventoryUnitSymbol = (component.inventoryUnit.stockUnit.inventoryUnits[0].unit
    .symbol as string).toLowerCase();

  if (componentUnitSymbol === "u" || inventoryUnitSymbol === "u") {
    return 0;
  }

  const inventoryUnit = math.unit(inventoryUnitQuantity, inventoryUnitSymbol);
  const componentUnit = math.unit(componentQuantity, componentUnitSymbol);
  return math
    .round(
      math
        .chain(math.divide(componentUnit, inventoryUnit))
        .multiply(inventoryUnitCost)
        .done(),
      4,
    );
};
