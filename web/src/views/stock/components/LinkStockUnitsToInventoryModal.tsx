import { Backdrop, Box, Button, Chip, Fade, Modal, Theme, Typography, withStyles } from "@material-ui/core";
import { StockUnit } from "@netpoe/restodynamics-api";
import React from "react";
import { useQuery } from "urql";
import { Card, CardTitle } from "../../../components";
import { QueryStockUnits } from "../../../graphql/queries";
import { styles } from "../../../theme";

export const LinkStockUnitsToInventoryModal = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(
  ({
    classes,
    onClose,
    ids,
    onConnect,
  }: {
    classes: any;
    onClose: () => void;
    ids: string[];
    onConnect: (stockUnitsIDs: string[]) => Promise<void>;
  }) => {
    const [open, setOpen] = React.useState(true);
    const [selectedStockUnitsIDs, setSelectedStockUnitsIDs] = React.useState<string[]>([]);
    const [stockUnitsQuery] = useQuery({
      query: QueryStockUnits,
      variables: { where: { id_not_in: ids } },
    });

    const onSelectStockUnit = (id: string) => {
      if (selectedStockUnitsIDs.includes(id)) {
        selectedStockUnitsIDs.splice(selectedStockUnitsIDs.indexOf(id), 1);
        setSelectedStockUnitsIDs([...selectedStockUnitsIDs]);
      } else {
        setSelectedStockUnitsIDs([...selectedStockUnitsIDs, id]);
      }
    };

    const onConnectStockUnitsIDs = async () => {
      try {
        await onConnect(selectedStockUnitsIDs);
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
                          selectedStockUnitsIDs.includes(stockUnit.id) ? "outlined" : "default"
                        }
                        color={selectedStockUnitsIDs.includes(stockUnit.id) ? "primary" : "default"}
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
