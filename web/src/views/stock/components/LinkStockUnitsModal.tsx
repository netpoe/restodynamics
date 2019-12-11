import { Backdrop, Box, Button, Chip, Fade, Modal, Theme, Typography, withStyles } from "@material-ui/core";
import { StockUnit } from "@netpoe/restodynamics-api";
import React from "react";
import { useQuery } from "urql";
import { Card, CardTitle } from "../../../components";
import { QueryStockUnits } from "../../../graphql/queries";

export const LinkStockUnitsModal = withStyles((theme: Theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stockUnitsList: {
    backgroundColor: theme.palette.background.default,
    minHeight: 140,
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  chip: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}))(
  ({
    classes,
    onClose,
    id,
    onConnect,
  }: {
    classes: any;
    onClose: () => void;
    id: string;
    onConnect: (componentsIDs: string[]) => Promise<void>;
  }) => {
    const [open, setOpen] = React.useState(true);
    const [selectedComponentsIDs, setSelectedComponentsIDs] = React.useState<string[]>([]);
    const [stockUnitsQuery] = useQuery({
      query: QueryStockUnits,
      variables: { where: { id_not: id } },
    });

    const onSelectStockUnit = (id: string) => {
      if (selectedComponentsIDs.includes(id)) {
        selectedComponentsIDs.splice(selectedComponentsIDs.indexOf(id), 1);
        setSelectedComponentsIDs([...selectedComponentsIDs]);
      } else {
        setSelectedComponentsIDs([...selectedComponentsIDs, id]);
      }
    };

    const onConnectStockUnitsIDs = async () => {
      try {
        await onConnect(selectedComponentsIDs);
        onClose();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box maxWidth="50vh">
            <Card
              actions={
                <>
                  <Button onClick={onClose}>Cancelar</Button>
                  <Button onClick={onConnectStockUnitsIDs} color="primary">
                    Vincular
                  </Button>
                </>
              }
            >
              <CardTitle>Vincular otras unidades de inventario</CardTitle>
              <Box className={classes.stockUnitsList}>
                {stockUnitsQuery.fetching ? (
                  <Typography>Cargando</Typography>
                ) : stockUnitsQuery.error || stockUnitsQuery.data == null ? (
                  <Typography>Error</Typography>
                ) : (
                  <>
                    {stockUnitsQuery.data.stockUnits.map((stockUnit: StockUnit, i: number) => (
                      <Chip
                        key={i}
                        label={stockUnit.name}
                        className={classes.chip}
                        onClick={() => {
                          onSelectStockUnit(stockUnit.id);
                        }}
                        variant={
                          selectedComponentsIDs.includes(stockUnit.id) ? "outlined" : "default"
                        }
                        color={selectedComponentsIDs.includes(stockUnit.id) ? "primary" : "default"}
                      />
                    ))}
                  </>
                )}
              </Box>
            </Card>
          </Box>
        </Fade>
      </Modal>
    );
  },
);
