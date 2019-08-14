import { prisma } from "./generated/prisma-client";
import {
  CreateStockUnit,
  CreateStockUnitCategory,
  CreateSupplier
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
    name: "ingredient"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "fuel"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "furniture"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "cutlery"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "tableware"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "kitchenware"
  });
  await prisma.$graphql(CreateStockUnitCategory, {
    name: "raw material"
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
    // await createStockUnit();
  } catch (error) {
    console.error(error);
  }
})();
