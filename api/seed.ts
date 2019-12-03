import { prisma } from "./generated/prisma-client";
import { CreateCurrency, CreateMeasurementUnit, CreateStockUnit, CreateStockUnitCategory, CreateSupplier } from "./mutations";

const supplier1 = "Cacaos San Juan la Laguna";
const supplier2 = "Especies Jony";

async function createSuppliers() {
  await prisma.$graphql(CreateSupplier, {
    name: supplier1,
    line1: "1a calle",
    line2: "122 ABC",
    region: "San Juan La Laguna, Sololá",
    country: "Guatemala",
    firstName: "María",
    lastName: "Pérez"
  });

  await prisma.$graphql(CreateSupplier, {
    name: supplier2,
    line1: "Mercado Central de Antigua Guatemala",
    line2: "Salón Interior",
    region: "Antigua Guatemala, Sacatepequez",
    country: "Guatemala",
    firstName: "Jony",
    lastName: "Rubio"
  });
}

async function createStockUnitCategories() {
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "sin categoría"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "ingrediente"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "combustible"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "muebles"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "cubiertos"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "vajilla"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "cocina"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "menú"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "producto"
  });
}

async function createMeasurementUnits() {
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Libra",
    symbol: "LB"
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Unidad",
    symbol: "U"
  });
}

async function createCurrencies() {
  await prisma.$graphql(CreateCurrency, {
    symbol: "GTQ",
    isDefault: true
  });
  await prisma.$graphql(CreateCurrency, {
    symbol: "USD",
  });
}

async function createStockUnit() {
  await prisma.$graphql(CreateStockUnit, {
    name: "Cacao 100%"
  });
}

(async function() {
  try {
    // await createSuppliers();
    await createStockUnitCategories();
    await createMeasurementUnits();
    await createCurrencies();
    // await createStockUnit();
  } catch (error) {
    console.error(error);
  }
})();
