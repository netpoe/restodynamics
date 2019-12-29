import { prisma } from "./generated/prisma-client";
import {
  CreateCurrency,
  CreateMeasurementUnit,
  CreateStockUnit,
  CreateStockUnitCategory,
  CreateSupplier,
} from "./mutations";

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
    lastName: "Pérez",
  });

  await prisma.$graphql(CreateSupplier, {
    name: supplier2,
    line1: "Mercado Central de Antigua Guatemala",
    line2: "Salón Interior",
    region: "Antigua Guatemala, Sacatepequez",
    country: "Guatemala",
    firstName: "Jony",
    lastName: "Rubio",
  });
}

async function createStockUnitCategories() {
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "sin categoría",
  });
  await prisma.$graphql(CreateStockUnitCategory, { name: "limpieza" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "carnes" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "alimentos" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "bebidas" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "gas" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "decoración" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "transporte" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "administración" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "mobiliario y equipo" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "maíz" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "producto" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "empaque" });
  await prisma.$graphql(CreateStockUnitCategory, { name: "menú" });
}

async function createMeasurementUnits() {
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Libra",
    symbol: "LB",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Unidad",
    symbol: "U",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Mano",
    symbol: "MAN",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Manojo",
    symbol: "MANJ",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Onza",
    symbol: "OZ",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Kilogramo",
    symbol: "KG",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Gramo",
    symbol: "G",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Litro",
    symbol: "L",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Mililitro",
    symbol: "ML",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Hora",
    symbol: "HR",
  });
  await prisma.$graphql(CreateMeasurementUnit, {
    name: "Minuto",
    symbol: "MIN",
  });
}

async function createCurrencies() {
  await prisma.$graphql(CreateCurrency, {
    symbol: "GTQ",
    isDefault: true,
  });
  await prisma.$graphql(CreateCurrency, {
    symbol: "USD",
  });
  await prisma.$graphql(CreateCurrency, {
    symbol: "MXN",
  });
  await prisma.$graphql(CreateCurrency, {
    symbol: "EUR",
  });
  await prisma.$graphql(CreateCurrency, {
    symbol: "BTC",
  });
  await prisma.$graphql(CreateCurrency, {
    symbol: "BCH",
  });
  await prisma.$graphql(CreateCurrency, {
    symbol: "ETH",
  });
}

async function createStockUnit() {
  await prisma.$graphql(CreateStockUnit, {
    name: "Cacao 100%",
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
