export const CreateSupplier = `
  mutation ($name: String!, $line1: String!, $line2: String!, $region: String!, $country: String!, $firstName: String!, $lastName: String!) {
    createSupplier(data: {
      name: $name
      address: {
        create: {
          line1: $line1
          line2: $line2
          region: $region
          country: $country
        }
      }
      contact: {
        create: {
          firstName: $firstName
          lastName: $lastName
        }
      }
    }) {
      id
      name
      contact {
        firstName
        lastName
        email
        phoneNumber
      }
      address {
        line1
        line2
        region
        city
        country
        zipCode
      }
    }
  }
`;

export const CreateStockUnitCategory = `
  mutation ($name: String!) {
    createStockUnitCategory(
      data: {
        name: $name
      }
    ) {
      id
      name
    }
  }
`;

export const CreateCurrency = `
  mutation ($symbol: String!) {
    createCurrency(
      data: {
        symbol: $symbol
      }
    ) {
      id
      symbol
    }
  }
`;

export const CreateMeasurementUnit = `
  mutation ($name: String!, $symbol: String!) {
    createMeasurementUnit(
      data: {
        name: $name
        symbol: $symbol
      }
    ) {
      id
      name
      symbol
    }
  }
`;

export const CreateStockUnit = `
  mutation ($name: String!) {
    createStockUnit(data: {
      name: $name
    }) {
      id
      name
    }
  }
`;

export const ConnectSupplierToStockUnit = `
  mutation ($id: String!, $supplierID: String!) {
    updateStockUnit(
      where: {
        id: $id
      },
      data: {
        supplier: {
          connect: {
            id: $supplierID
          }
        }
      }) {
      id
      name
      supplier {
        id
      }
      stockUnitCategory {
        id
        es_ES
      }
    }
  }
`;
