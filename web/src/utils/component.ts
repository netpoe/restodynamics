import * as math from "mathjs";

math.createUnit(
  {
    unit: {
      definition: "1 oz",
      aliases: ["u", "U"],
    },
  },
  {
    override: true,
  },
);

export const getComponentAsMathUnit = (component: any) => {
  const componentQuantity = component.inventoryUnit.quantity;
  const componentUnitSymbol = (component.inventoryUnit.unit.symbol as string).toLowerCase();
  return math.unit(componentQuantity, componentUnitSymbol);
};

export const getComponentInventoryUnitAsMathUnit = (component: any) => {
  const inventoryUnit = component.inventoryUnit.stockUnit.inventoryUnits[0];
  if (!Boolean(inventoryUnit)) {
    return math.unit("unit");
  }
  const inventoryUnitQuantity = inventoryUnit.quantity;
  const inventoryUnitSymbol = (inventoryUnit.unit.symbol as string).toLowerCase();
  return math.unit(inventoryUnitQuantity, inventoryUnitSymbol);
};

export const getComponentMeasurementUnitEquivalenceToInventory = (component: any) => {
  try {
    return math.divide(
      getComponentAsMathUnit(component),
      getComponentInventoryUnitAsMathUnit(component),
    );
  } catch (error) {
    console.error(error);
    return 0;
  }
};

export const getComponentCostByMeasurementUnit = (component: any): number => {
  const inventoryUnit = component.inventoryUnit.stockUnit.inventoryUnits[0];
  if (!Boolean(inventoryUnit)) {
    return 0;
  }
  const cost = Boolean(inventoryUnit) ? inventoryUnit.expenseUnit.amount : 0;
  try {
    const result = math
      .chain(getComponentMeasurementUnitEquivalenceToInventory(component))
      .multiply(cost)
      .done(); // .done() may return a Unit when units' taxonomy do not match
    return typeof result === "object" ? 0 : result;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
