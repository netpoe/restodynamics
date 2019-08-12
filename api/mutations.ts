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
  mutation ($en_EN: String!, $es_ES: String!) {
    createStockUnitCategory(
      data: {
        en_EN: $en_EN
        es_ES: $es_ES
      }
    ) {
      id
      en_EN
      es_ES
      createdAt
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
