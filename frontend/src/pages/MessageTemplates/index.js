import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import { toast } from "react-toastify";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";

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
  const [checkinTemplate, setCheckinTemplate] = useState("");
  const [feedbackTemplate, setFeedbackTemplate] = useState("");
  const [checkoutTemplate, setCheckoutTemplate] = useState("");

  // Função executada ao carregar a página para buscar os modelos de mensagem
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Função para buscar os modelos de mensagem nos endpoints correspondentes
  const fetchTemplates = async () => {
    try {
      // Busca dos modelos de mensagem nos endpoints corretos do Xano
      const [checkinResponse, feedbackResponse, checkoutResponse] = await Promise.all([
        api.get("https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_msgs/checkin/{template_msgs_id}"),
        api.get("https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_msgs/feedback/{template_msgs_id}"),
        api.get("https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_msgs/checkout/{template_msgs_id}"),
      ]);

      // Atualização dos estados com os modelos de mensagem obtidos
      setCheckinTemplate(checkinResponse.data.template);
      setFeedbackTemplate(feedbackResponse.data.template);
      setCheckoutTemplate(checkoutResponse.data.template);
    } catch (err) {
      // Tratamento de erro em caso de falha ao buscar os modelos de mensagem
      toast.error("Failed to fetch message templates");
    }
  };

  // Função para atualizar o modelo de mensagem no servidor
  const handleUpdateTemplate = async (endpoint, template) => {
    try {
      // Requisição PATCH para o endpoint correspondente com o novo modelo de mensagem
      await api.patch(endpoint, { template });
      // Notificação de sucesso após atualização
      toast.success("Template updated successfully");
    } catch (err) {
      // Tratamento de erro em caso de falha ao atualizar o modelo de mensagem
      toast.error("Failed to update template");
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
                onClick={() => handleUpdateTemplate("https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_checkin/{template_msgs_id}", checkinTemplate)}
              >
                Atualizar
              </Button>
            </div>
          </Grid>
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
                onClick={() => handleUpdateTemplate("https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_feedback/{template_msgs_id}", feedbackTemplate)}
              >
                Atualizar
              </Button>
            </div>
          </Grid>
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
                onClick={() => handleUpdateTemplate("https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_checkout/{template_msgs_id}", checkoutTemplate)}
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
