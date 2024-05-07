import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { toast } from "react-toastify";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import socketConnection from "../../services/socketConnection";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  messageContainer: {
    marginBottom: theme.spacing(2),
    borderRadius: 8,
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
}));

const MessageTemplates = () => {
  const classes = useStyles();
  const [companyId, setCompanyId] = useState(null);
  const [checkinTemplate, setCheckinTemplate] = useState("");
  const [feedbackTemplate, setFeedbackTemplate] = useState("");
  const [checkoutTemplate, setCheckoutTemplate] = useState("");

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    setCompanyId(storedCompanyId);

    const socket = socketConnection({ companyId: storedCompanyId });

    socket.on(`company-${storedCompanyId}-settings`, (data) => {
      if (data.action === "update") {
        // Handle settings update if needed
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchTemplates();
    }
  }, [companyId]);

  const fetchTemplates = async () => {
    try {
      const [
        checkinResponse,
        feedbackResponse,
        checkoutResponse,
      ] = await Promise.all([
        api.get(`https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_msgs/checkin/${companyId}`),
        api.get(`https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_msgs/feedback/${companyId}`),
        api.get(`https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_msgs/checkout/${companyId}`),
      ]);

      setCheckinTemplate(checkinResponse.data.template);
      setFeedbackTemplate(feedbackResponse.data.template);
      setCheckoutTemplate(checkoutResponse.data.template);
    } catch (err) {
      toast.error("Falha ao carregar os modelos de mensagens");
    }
  };

  const handleUpdateTemplate = async (endpoint, template) => {
    try {
      await api.patch(endpoint, { template });
      toast.success("Mensagem atualizada com sucesso!");
    } catch (err) {
      toast.error("Falha ao atualizar mensagem");
    }
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>Modelos de Mensagem</Title>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <div className={classes.messageContainer}>
              <TextField
                className={classes.textField}
                fullWidth
                label="Token do chip"
                variant="outlined"
                value={checkinTemplate}
                onChange={(e) => setCheckinTemplate(e.target.value)}
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Mensagem de Boas Vindas"
                variant="outlined"
                multiline
                rows={4}
                value={checkinTemplate}
                onChange={(e) => setCheckinTemplate(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleUpdateTemplate(
                    `https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_checkin/${companyId}`,
                    checkinTemplate
                  )
                }
              >
                Atualizar
              </Button>
            </div>
          </Grid>
          {/* Feedback Template */}
          <Grid item>
            <div className={classes.messageContainer}>
              <TextField
                className={classes.textField}
                fullWidth
                label="Token do chip"
                variant="outlined"
                value={feedbackTemplate}
                onChange={(e) => setFeedbackTemplate(e.target.value)}
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Feedback Inicial"
                variant="outlined"
                multiline
                rows={4}
                value={feedbackTemplate}
                onChange={(e) => setFeedbackTemplate(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleUpdateTemplate(
                    `https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_feedback/${companyId}`,
                    feedbackTemplate
                  )
                }
              >
                Atualizar
              </Button>
            </div>
          </Grid>
          {/* Checkout Template */}
          <Grid item>
            <div className={classes.messageContainer}>
              <TextField
                className={classes.textField}
                fullWidth
                label="Token do chip"
                variant="outlined"
                value={checkoutTemplate}
                onChange={(e) => setCheckoutTemplate(e.target.value)}
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Satisfação no Checkout"
                variant="outlined"
                multiline
                rows={4}
                value={checkoutTemplate}
                onChange={(e) => setCheckoutTemplate(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleUpdateTemplate(
                    `https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_checkout/${companyId}`,
                    checkoutTemplate
                  )
                }
              >
                Atualizar
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </MainContainer>
  );
};

export default MessageTemplates;
