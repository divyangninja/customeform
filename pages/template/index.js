import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import style from "../template/template.module.css";
import SubTemplate from "./subTemplate/SubTemplate";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_TEMPLATE_LIST } from "@/query/query";

function TemplatePage(props) {
  const [open, setOpen] = useState(false);

  const { data: tempData, loading: loadingTempData } = useQuery(
    GET_TEMPLATE_LIST,
    {}
  );

  const [templateData, setTemplateData] = useState([]);

  useEffect(() => {
    if (!loadingTempData && tempData?.getAllTemplateData.length > 0) {
      setTemplateData(tempData?.getAllTemplateData);
    }
  }, [loadingTempData, tempData]);

  const handleModel = (value) => {
    setOpen(value);
  };

  return (
    <div className={style.templateContainer}>
      <Box className={style.add}>
        <Button
          className={style.btnAdd}
          variant="outlined"
          onClick={() => handleModel(true)}
        >
          Add Template
        </Button>
        <Dialog
          open={open}
          onClose={handleModel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Add Template"}</DialogTitle>
          <DialogContent>
            <SubTemplate handleModel={handleModel} data={{}} />
          </DialogContent>
        </Dialog>
      </Box>
      {templateData.length > 0 ? (
        <Box className={style.templateBox}>
          {templateData.map((itm, index) => {
            return (
              <Link key={`link_${index}`}
                className={style.cardTemp}
                href={{
                  pathname: `/template/${itm.TemplateName}`,
                  query: { id: itm.TemplateId },
                }}
              >
                <Card>
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {itm.TemplateTitle}
                    </Typography>
                    <Typography sx={{ float: "left" }}>Fields :</Typography>
                    <br></br>
                    <br></br>
                    <Divider></Divider>
                    <ul>
                      {itm?.TemplateField?.map((item,index) => (
                        <li key={`li_${index}`} id={style.listItm}>{item.title}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </Box>
      ) : (
        <Box className={style.noFound}>
          <Box>No Templates Found!</Box>
        </Box>
      )}
    </div>
  );
}

export default TemplatePage;
