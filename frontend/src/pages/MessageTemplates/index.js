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

import { xanoApi } from "../../services/api"; // Importar xanoApi em vez de api
import { socketConnection } from "../../services/socket";

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
  const [checkinToken, setCheckinToken] = useState("");
  const [feedbackToken, setFeedbackToken] = useState("");
  const [checkoutToken, setCheckoutToken] = useState("");
  const [checkinTemplate, setCheckinTemplate] = useState("");
  const [feedbackTemplate, setFeedbackTemplate] = useState("");
  const [checkoutTemplate, setCheckoutTemplate] = useState("");
  const [loading, setLoading] = useState(true);

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
      const templateRequests = [
        xanoApi.get(`/template_msgs/checkin/{template_msgs_id}?template_msgs_id=${companyId}`),
        xanoApi.get(`/template_msgs/feedback/{template_msgs_id}?template_msgs_id=${companyId}`),
        xanoApi.get(`/template_msgs/checkout/{template_msgs_id}?template_msgs_id=${companyId}`),
      ];

      const [
        checkinResponse,
        feedbackResponse,
        checkoutResponse,
      ] = await Promise.all(templateRequests);

      setCheckinToken(checkinResponse.data.token);
      setCheckinTemplate(checkinResponse.data.template);
      setFeedbackToken(feedbackResponse.data.token);
      setFeedbackTemplate(feedbackResponse.data.template);
      setCheckoutToken(checkoutResponse.data.token);
      setCheckoutTemplate(checkoutResponse.data.template);
    } catch (err) {
      toast.error("A integração com os modelos falhou. Entre em contato com o suporte.");
      setLoading(false);
    }
  };

  const handleUpdateCheckinTemplate = async () => {
    try {
      await xanoApi.patch(`/template_checkin/{template_msgs_id}?template_msgs_id=${companyId}&token_checkin=${checkinToken}&template_checkin=${checkinTemplate}&hoteis_id=${companyId}`);
      toast.success("Mensagem de checkin atualizada com sucesso!");
    } catch (err) {
      toast.error("Falha ao atualizar mensagem de checkin");
    }
  };

  const handleUpdateFeedbackTemplate = async () => {
    try {
      await xanoApi.patch(`/template_feedback/{template_msgs_id}?template_msgs_id=${companyId}&token_feedback=${feedbackToken}&template_feedback=${feedbackTemplate}&hoteis_id=${companyId}`);
      toast.success("Mensagem de feedback atualizada com sucesso!");
    } catch (err) {
      toast.error("Falha ao atualizar mensagem de feedback");
    }
  };

  const handleUpdateCheckoutTemplate = async () => {
    try {
      await xanoApi.patch(`/template_checkout/{template_msgs_id}?template_msgs_id=${companyId}&token_checkout=${checkoutToken}&template_checkout=${checkoutTemplate}&hoteis_id=${companyId}`);
      toast.success("Mensagem de checkout atualizada com sucesso!");
    } catch (err) {
      toast.error("Falha ao atualizar mensagem de checkout");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <MainContainer>
      <MainHeader>
        <Title>Modelos de Mensagem</Title>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        <Grid container direction="column" spacing={3}>
          {/* Template de Checkin */}
          <Grid item>
            <div className={classes.messageContainer}>
              <TextField
                className={classes.textField}
                fullWidth
                label="Token do chip"
                variant="outlined"
                value={checkinToken}
                onChange={(e) => setCheckinToken(e.target.value)}
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Mensagem de Checkin"
                variant="outlined"
                multiline
                rows={4}
                value={checkinTemplate}
                onChange={(e) => setCheckinTemplate(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateCheckinTemplate}
              >
                Atualizar
              </Button>
            </div>
          </Grid>
          {/* Template de Feedback */}
          <Grid item>
            <div className={classes.messageContainer}>
              <TextField
                className={classes.textField}
                fullWidth
                label="Token do chip"
                variant="outlined"
                value={feedbackToken}
                onChange={(e) => setFeedbackToken(e.target.value)}
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Mensagem de Feedback"
                variant="outlined"
                multiline
                rows={4}
                value={feedbackTemplate}
                onChange={(e) => setFeedbackTemplate(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateFeedbackTemplate}
              >
                Atualizar
              </Button>
            </div>
          </Grid>
          {/* Template de Checkout */}
          <Grid item>
            <div className={classes.messageContainer}>
              <TextField
                className={classes.textField}
                fullWidth
                label="Token do chip"
                variant="outlined"
                value={checkoutToken}
                onChange={(e) => setCheckoutToken(e.target.value)}
              />
              <TextField
                className={classes.textField}
                fullWidth
                label="Mensagem de Checkout"
                variant="outlined"
                multiline
                rows={4}
                value={checkoutTemplate}
                onChange={(e) => setCheckoutTemplate(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateCheckoutTemplate}
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
