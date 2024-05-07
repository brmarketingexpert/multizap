import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography"; // Importação do componente Typography
import { toast } from "react-toastify";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import { socketConnection } from "../../services/socket";

// Estilos CSS customizados
const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles, // Estilos personalizados para scrollbars
  },
  messageContainer: {
    marginBottom: theme.spacing(2),
    borderRadius: 8,
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  errorMessage: {
    marginTop: theme.spacing(2), // Adicionando margem superior para separar da seção anterior
  },
}));

const MessageTemplates = () => {
  const classes = useStyles();
  const [companyId, setCompanyId] = useState(null);
  const [checkinTemplate, setCheckinTemplate] = useState("");
  const [feedbackTemplate, setFeedbackTemplate] = useState("");
  const [checkoutTemplate, setCheckoutTemplate] = useState("");
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento dos dados
  const [error, setError] = useState(false); // Estado para controlar se ocorreu um erro na carga dos dados

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    setCompanyId(storedCompanyId);

    const socket = socketConnection({ companyId: storedCompanyId });

    // Subscreve-se a alterações nos ajustes da empresa via socket
    socket.on(`company-${storedCompanyId}-settings`, (data) => {
      if (data.action === "update") {
        // Lida com a atualização de ajustes, se necessário
      }
    });

    return () => {
      socket.disconnect(); // Desconecta o socket quando o componente é desmontado
    };
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchTemplates();
    } else {
      setLoading(false); // Define o estado de carregamento como concluído para exibir a mensagem de erro
    }
  }, [companyId]);

  // Função para buscar os templates de mensagens
  const fetchTemplates = async () => {
    try {
      const xanoToken = process.env.XANO_TOKEN; // Obtém o token de acesso do ambiente
      const headers = { Authorization: `Bearer ${xanoToken}` }; // Cabeçalho de autorização
      const templateRequests = [
        // Requisições assíncronas para obter os templates
        api.get(`https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_msgs/checkin?template_msgs_id=${companyId}`, { headers }),
        api.get(`https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_msgs/feedback?template_msgs_id=${companyId}`, { headers }),
        api.get(`https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_msgs/checkout?template_msgs_id=${companyId}`, { headers }),
      ];

      const [
        checkinResponse,
        feedbackResponse,
        checkoutResponse,
      ] = await Promise.all(templateRequests);

      // Atualiza os estados com os templates obtidos
      setCheckinTemplate(checkinResponse.data.template);
      setFeedbackTemplate(feedbackResponse.data.template);
      setCheckoutTemplate(checkoutResponse.data.template);
    } catch (err) {
      // Trata os erros durante a requisição
      setError(true); // Define o estado de erro como verdadeiro
      toast.error("Não foi possível sincronizar as mensagens. Entre em contato com o suporte.");
    } finally {
      setLoading(false); // Define o estado de carregamento como concluído
    }
  };

  // Função para atualizar um template
  const handleUpdateTemplate = async (endpoint, template) => {
    try {
      const xanoToken = process.env.XANO_TOKEN; // Obtém o token de acesso do ambiente
      const headers = { Authorization: `Bearer ${xanoToken}` }; // Cabeçalho de autorização
      const payload = { template_msgs_id: companyId, template }; // Payload da requisição
      await api.patch(endpoint, payload, { headers }); // Requisição PATCH para atualizar o template
      toast.success("Mensagem atualizada com sucesso!"); // Exibe mensagem de sucesso
    } catch (err) {
      // Trata os erros durante a requisição
      toast.error("Falha ao atualizar mensagem"); // Exibe mensagem de erro
    }
  };

  // Se houver um erro na carga dos templates, exibe uma mensagem de erro na página
  if (error) {
    return (
      <MainContainer>
        <Typography variant="h6" color="error" className={classes.errorMessage}>
          Não foi possível carregar os templates. Entre em contato com o suporte.
        </Typography>
      </MainContainer>
    );
  }

  // Se estiver carregando os templates, exibe uma mensagem de carregamento na página
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não houver erro e os templates foram carregados, exibe os campos de templates na página
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
                    `https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_checkin/{template_msgs_id}`,
                    checkinTemplate
                  )
                }
              >
                Atualizar
              </Button>
            </div>
          </Grid>
          {/* Seção de template de Feedback */}
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
                    `https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_feedback/{template_msgs_id}`,
                    feedbackTemplate
                  )
                }
              >
                Atualizar
              </Button>
            </div>
          </Grid>
          {/* Seção de template de Checkout */}
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
                    `https://x8ki-letl-twmt.n7.xano.io/api:LP1Qco7D/template_checkout/{template_msgs_id}`,
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
