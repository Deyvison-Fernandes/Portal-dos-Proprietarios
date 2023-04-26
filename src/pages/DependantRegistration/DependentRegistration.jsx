import { useEffect, useState } from 'react';
import {
  getOwnerData,
  updateDependent,
  updateOwner
} from '../../services/owner';
import { FlexItem, Title } from '../../styles';
import { colors } from '../../theme';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  OutlinedInput,
  Checkbox,
  Button
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListSubheader from '@mui/material/ListSubheader'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import profissoesList from '../../data/profissoes.json';
import { ptBR } from '@mui/x-date-pickers/locales';

const DependantRegistration = () => {
  
  const [openMessage, setOpenMessage] = useState(false);
  const [openMessageErr, setOpenMessageErr] = useState(false);
  const [openMessageLoad, setOpenMessageLoad] = useState(false);
  const [proprietario, setProprietario] = useState(null);
  const [proprietarioErro, setProprietarioErro] = useState({
    nome: false,
    nascimento: false,
    cpf_cnpj: false,
    profissao_outros: false
  });
  
  const [conjugeErro, setConjugeErro] = useState({
    nome: false,
    nascimento: false,
    cpf_cnpj: false,
    profissao_outros: false
  });
  const [dependentes, setDependentes] = useState([]);
  const [exibirProfissao, setExibirProfissao] = useState(false);
  const errosDependentes = {
    nome: false,
    nascimento: false,
    cpf: false,
    grau_parentesco: false
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let id = Number(e.target.id.value) || undefined;

    const person = {
      nome: e.target.nome?.value,
      nascimento: e.target.nasc?.value || null,
      cpf_cnpj: e.target.cpf_cnpj?.value,
      cpf: e.target.cpf_cnpj?.value,
      telefone: e.target.telefone?.value,
      email: e.target.email?.value,
      cep: e.target.cep?.value,
      dt_atu: e.target.dt_atu?.value,
      dt_inc: e.target.dt_inc?.value,
      endereco: e.target.endereco?.value,
      bairro: e.target.bairro?.value,
      numero: e.target.numero?.value,
      municipio: e.target.municipio?.value,
      uf: e.target.uf?.value,
      pais: e.target.pais?.value,
      complemento: e.target.complemento?.value,
      profissao: e.target.profissao?.value,
      profissao_outros: e.target.profissao_outros?.value,
      aniversario_casamento: e.target.aniversario_casamento?.value,
      grau_parentesco: e.target.grau_parentesco?.value
    };
    
    if(erroCampos(person)){
      return false;
    }

    if(person.profissao === "Outros"){
      person.profissao = person.profissao_outros;
    }
    
    let propObj = proprietario;
    if(!person.grau_parentesco){
      propObj = {...propObj, ...person};
    }else{
      const conjuge = propObj.dependentes.find(x => x.grau_parentesco === "Cônjuge");
      propObj.dependentes = propObj.dependentes.filter(x => x.id !== id);

      if(conjuge){
        propObj.dependentes.push({...conjuge, ...person});
      }else{
        propObj.dependentes.push(person);
      }
    }

    setProprietario(propObj);
    saveOwner(propObj);
  }

  const addFormDependente = () => {
    setDependentes([...dependentes, {
      id: null,
      key: 0,
      ativo: true,
      nome: '',
      cpf: '',
      grau_parentesco: '',
      nascimento: '',
      erros: {
        nome: false,
        nascimento: false,
        cpf: false,
        grau_parentesco: false
      }
    }])
  }

  const erroCampos = (person) => {
    let formError = {
      nome: (person.nome.trim().length === 0),
      nascimento: (person.nascimento == null || person.nascimento.trim().length === 0),
      cpf_cnpj: (person.cpf_cnpj.trim().length === 0)
    };

    if(person.profissao === "Outros"){
      formError.profissao_outros = (person.profissao_outros.trim().length === 0);
    }else{
      formError.profissao_outros = false;
    }

    if(!person.grau_parentesco){
      setProprietarioErro({...formError});
    }else{
      setConjugeErro({...formError});
    }

    let erroCampo = (
      formError.nome ||
      formError.nascimento ||
      formError.cpf_cnpj ||
      formError.profissao_outros
    );

    return erroCampo;
  }

  const erroCamposDependente = (dependente) => {
    dependentes[dependente.key].erros.nome = (dependente.nome.trim().length === 0);
    dependentes[dependente.key].erros.grau_parentesco = (dependente.grau_parentesco.trim().length === 0);
    dependentes[dependente.key].erros.cpf = (dependente.cpf.trim().length === 0);
    dependentes[dependente.key].erros.nascimento = (dependente.nascimento.trim().length === 0);

    setDependentes([...dependentes]);

    let erroCampo = (
      dependentes[dependente.key].erros.nome ||
      dependentes[dependente.key].erros.grau_parentesco ||
      dependentes[dependente.key].erros.cpf ||
      dependentes[dependente.key].erros.nascimento
    );

    return erroCampo;
  }

  const handleSubmitDependentes = async (key) => {
    if(!erroCamposDependente(dependentes[key])){
      let listDep = proprietario.dependentes.filter((x) => x.id !== dependentes[key].id);
      const propObj = {...proprietario, dependentes: [...listDep, dependentes[key]]};
      saveOwner(propObj);
    }
  }

  const saveOwner = async (propObj) => {
    setOpenMessageLoad(true);
    
    updateOwner(propObj)
    .then((value) => {
      if(value.status === 200){
        setOpenMessage(true);
        setOpenMessageLoad(false);
      }else{
        setOpenMessageErr(true);
        setOpenMessageLoad(false);
      }
    });
  };

  useEffect(async () => {
    const { data } = await getOwnerData();
    setProprietario(data);

    const listaDependentes = data.dependentes.filter((x) => x.grau_parentesco !== "Cônjuge");
    listaDependentes.forEach(item => {
      item.erros = Object.assign({}, errosDependentes);
    });

    setDependentes([...listaDependentes]);
  }, []);

  const formDependente = (dependente) => {
    return (
      <Accordion
        sx={{ margin: '1em 0' }}
        key={`key-${dependente?.key}`}
      >
        <AccordionSummary
          sx={{ padding: '0 1em', fontWeight: 500 }}
          expandIcon={<ExpandMoreIcon />}>
          <Title fontSize='18px' color={colors.darkGray} padding={0} mb='1em'>
            {dependente.nome !== '' ? dependente.nome : 'Dependente'}
          </Title>

        </AccordionSummary>
        <AccordionDetails>
          
          <FlexItem flex>
            <FormControl variant="outlined"
              sx={{ width: '70%', marginRight: '1em' }}
              error={dependente.erros.nome}>

              <OutlinedInput placeholder='Nome' defaultValue={dependente.nome}
                onChange={(event) => {
                  dependentes[dependente.key].nome = event.target.value;
                  setDependentes(dependentes);
                }}
                />
              {dependente.erros.nome ? <FormHelperText id="component-error-text">Por favor informe o nome.</FormHelperText> : null}
            </FormControl>
            <FormControl error={dependente.erros.nascimento} variant="outlined">
              <LocalizationProvider dateAdapter={AdapterDayjs} localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText} adapterLocale="pt-br">
                <MobileDatePicker
                  defaultValue={dependente.nascimento ? dayjs(dependente.nascimento, 'DD/MM/YYYY') : null}
                  maxDate={dayjs()}
                  onChange={(value) => {
                    dependentes[dependente.key].nascimento = dayjs(value).format('DD/MM/YYYY');
                    setDependentes(dependentes);
                  }}
                  label="Data de nascimento"
                  format="DD/MM/YYYY"/>
                  {dependente.erros.nascimento ? <FormHelperText id="component-error-text">Por favor informe a data de nascimento.</FormHelperText> : null}
              </LocalizationProvider>
            </FormControl>
          </FlexItem>
          <FlexItem flex margin='.5em 0'>
            <FormControl error={dependente.erros.cpf}
            variant="outlined" sx={{ width: '30%', marginRight: '1em' }}
            onChange={(event) => {
              dependentes[dependente.key].cpf = event.target.value;
              setDependentes(dependentes);
            }}>
              <OutlinedInput placeholder='CPF' defaultValue={dependente.cpf}/>
              {dependente.erros.cpf ? <FormHelperText id="component-error-text">Por favor informe o CPF.</FormHelperText> : null}
            </FormControl>

            <FormControl error={dependente.erros.grau_parentesco}
            variant="outlined" sx={{ width: '60%', marginRight: '1em' }}>
              <Select
                id='grau_parentesco'
                defaultValue={dependente.grau_parentesco}
                displayEmpty
                input={<OutlinedInput />}
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(event) => {
                  dependentes[dependente.key].grau_parentesco = event.target.value;
                  setDependentes(dependentes);
                }}
              >
                <MenuItem disabled value="">
                  <em
                    style={{    
                        color: '#adadad',
                        fontStyle: 'inherit',
                        fontWeight: '300'
                  }}>
                    Grau de parentesco
                  </em>
                </MenuItem>
                
                <ListSubheader style={{fontWeight: "bold"}}>Ascendente</ListSubheader>
                <MenuItem value='Pai e Mãe'>Pai e Mãe</MenuItem>
                <MenuItem value='Avô e Avó'>Avô e Avó</MenuItem>
                <MenuItem value='Bisavô e Bisavó'>Bisavô e Bisavó</MenuItem>

                <ListSubheader style={{fontWeight: "bold"}}>Descendente</ListSubheader>
                <MenuItem value='Filho e Filha'>Filho e Filha</MenuItem>
                <MenuItem value='Neto e Neta'>Neto e Neta</MenuItem>
                <MenuItem value='Bisneto e Bisneta'>Bisneto e Bisneta</MenuItem>
                <MenuItem value='Irmão e Irmã'>Irmão e Irmã</MenuItem>
                <MenuItem value='Tio e Tia, Sobrinho'>Tio e Tia, Sobrinho</MenuItem>
              </Select>

              {dependente.erros.grau_parentesco ? <FormHelperText id="component-error-text">Por favor informe o grau de parentesco.</FormHelperText> : null}
            </FormControl>

            <FormControl variant="outlined" sx={{ width: '10%' }}>
                <FormControlLabel
                  control={
                    <Checkbox name="ativo" color='success' defaultChecked={dependente.ativo}
                      onChange={(event) => {
                        dependentes[dependente.key].ativo = event.target.checked;
                        setDependentes(dependentes);
                        
                        if(dependente.id){
                          updateDependent(dependente.id, event.target.checked ? '1' : '0');
                        }
                      }}
                    />
                  }
                  label="Ativo"
                />
              </FormControl>
          </FlexItem>
          
          <Button
              style={{
                marginLeft: 'auto',
                marginTop: '3em',
                right: '0px',
                display: 'flex',
                backgroundColor: colors.gray,
                width: '200px'
              }}
              type='button'
              onClick={() => handleSubmitDependentes(dependente.key)}>
              SALVAR
          </Button>
        </AccordionDetails>
      </Accordion>
    );
  }

  const AddOutlinedInput = (placeholder, id, defaultValue, sx) => (
    <OutlinedInput placeholder={placeholder} id={id} defaultValue={defaultValue} sx={sx}/>
  );

  const form = (formData, title, defaultExpanded, formError) => {
    return (
      <Accordion
        defaultExpanded={defaultExpanded}
        sx={{ margin: '1em 0' }}>
        <AccordionSummary
          sx={{ padding: '0 1em', fontWeight: 500 }}
          expandIcon={<ExpandMoreIcon />}>
          <Title fontSize='18px' color={colors.darkGray} padding={0} mb='1em'>
            {title}
          </Title>
        </AccordionSummary>
        <AccordionDetails>
        <div>
          <form onSubmit={handleSubmit}>
            <input id='id' defaultValue={formData?.id} style={{ visibility: 'hidden' }}/>
            <FlexItem flex>
              <FormControl variant="outlined"
                  sx={{ width: '70%', marginRight: '1em' }}
                  error={formError.nome} >
                {AddOutlinedInput('Nome', 'nome', formData?.nome)}
                {formError.nome ? <FormHelperText id="component-error-text">Por favor informe o nome.</FormHelperText> : null}
              </FormControl>

              <FormControl error={formError.nascimento} variant="outlined">
                <LocalizationProvider dateAdapter={AdapterDayjs} localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText} adapterLocale="pt-br">
                  <MobileDatePicker slotProps={{textField: {id: 'nasc'}}}
                    maxDate={dayjs()}
                    label="Data de nascimento"
                    format="DD/MM/YYYY"
                    defaultValue={ formData && formData.nascimento ? dayjs(formData.nascimento, 'DD/MM/YYYY') : null}/>
                    {formError.nascimento ? <FormHelperText id="component-error-text">Por favor informe a data de nascimento.</FormHelperText> : null}
                </LocalizationProvider>
              </FormControl>
            </FlexItem>
            <FlexItem flex margin='.5em 0'>
              <FormControl error={formError.cpf_cnpj} variant="outlined" sx={{ width: '33%', marginRight: '1em' }}>
                {AddOutlinedInput('CPF/CNPJ', 'cpf_cnpj', (formData && formData.cpf_cnpj ? formData.cpf_cnpj : formData.cpf))}
                {formError.cpf_cnpj ? <FormHelperText id="component-error-text">Por favor informe o CPF/CNPJ.</FormHelperText> : null}
              </FormControl>

              <FormControl variant="outlined" sx={{ width: '33%', marginRight: '1em' }}>
                {AddOutlinedInput('Telefone (WhatsApp)', 'telefone', formData?.telefone)}
              </FormControl>

              <FormControl variant="outlined" sx={{ width: '33%'}}>
                {AddOutlinedInput('Email', 'email', formData?.email)}
              </FormControl>
            </FlexItem>
            <FlexItem flex margin='.5em 0'>
              {AddOutlinedInput('CEP', 'cep', formData?.cep, { width: '15%', marginRight: '1em' })}
              {AddOutlinedInput('Endereço', 'endereco', formData?.endereco, {width: '45%', marginRight: '1em'})}
              {AddOutlinedInput('Bairro', 'bairro', formData?.bairro, {width: '25%', marginRight: '1em'})}
              {AddOutlinedInput('Nro', 'numero', formData?.numero, {width: '10%'})}
            </FlexItem>
            <FlexItem flex margin='.5em 0'>
              {AddOutlinedInput('Cidade', 'municipio', formData?.municipio, {width: '33%', marginRight: '1em'})}
              {AddOutlinedInput('UF', 'uf', formData?.uf, {width: '10%', marginRight: '1em'})}
              {AddOutlinedInput('País', 'pais', formData?.pais, {width: '10%', marginRight: '1em'})}
              {AddOutlinedInput('Complemento', 'complemento', formData?.complemento, {width: '47%'})}
            </FlexItem>
            <FlexItem flex margin='.5em 0'>
              <Autocomplete
                id="profissao"
                defaultValue={formData?.profissao}
                options={profissoesList}
                sx={{ width: '50%', marginRight: '1em' }}
                renderInput={(params) => <TextField {...params} placeholder="Profissão" />}
                onChange={(_, newValue) => {
                  setExibirProfissao((newValue === "Outros"));
                }}
              />
              {title !== 'Cônjuge' ?
              <LocalizationProvider dateAdapter={AdapterDayjs} localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText} adapterLocale="pt-br">
                <MobileDatePicker sx={{ width: '50%' }} slotProps={{textField: {id: 'aniversario_casamento'}}}
                maxDate={dayjs()}
                label="Aniversário de casamento" format="DD/MM/YYYY"
                defaultValue={formData && formData.aniversario_casamento ? dayjs(formData.aniversario_casamento, 'DD/MM/YYYY') : null}/>
              </LocalizationProvider> : <input id='grau_parentesco' defaultValue="Cônjuge" style={{ visibility: 'hidden' }}/>}
            </FlexItem>
            {exibirProfissao &&
            <FlexItem flex margin='.5em 0'>
              <FormControl error={formError.profissao_outros} variant="outlined" sx={{ width: '49%', marginRight: '1em' }}>
                {AddOutlinedInput('Digite a Profissão', 'profissao_outros', formData?.profissao)}
                {formError.profissao_outros ? <FormHelperText id="component-error-text">Por favor digite a profissão.</FormHelperText> : null}
              </FormControl>
            </FlexItem>}
            <Button
              style={{
                marginLeft: 'auto',
                marginTop: '3em',
                right: '0px',
                display: 'flex',
                backgroundColor: colors.gray,
                width: '200px'
              }}
              type='submit'>
              SALVAR
            </Button>
          </form>
        </div>
        </AccordionDetails>
      </Accordion>
    );
  }

  if (!proprietario) return null;
  return (
    <div style={{marginBottom: '20em', height: '100vh'}}>
      
      {form(proprietario, "Proprietário", true, proprietarioErro)}
      {form(proprietario.dependentes.find(x => x.grau_parentesco === "Cônjuge"), "Cônjuge", false, conjugeErro)}

      <Title fontSize='18px' color={colors.darkGray} padding={0} mb='1em'>
        Dependentes
      </Title>
      {
        dependentes.map((d, i) => {
          d.key = i; 
          return formDependente(d);
        })
      }
      <Button onClick={addFormDependente} style={{ marginBottom: '3em' }}>
        Adicionar dependente
      </Button>

      <Snackbar open={openMessageLoad} autoHideDuration={2000}
        message={(
        <>
          <CircularProgress
            variant="indeterminate"
            color="inherit"
            disableShrink
            size={20}
            thickness={4}
            style={{marginRight: '16px'}}
          />
          Enviando dados...
        </>)}>
          
      </Snackbar>

      <Snackbar open={openMessage} autoHideDuration={4000} onClose={() => {setOpenMessage(false);}}>
        <MuiAlert elevation={6} variant="filled" severity="success">
          Dados salvos com sucesso.
        </MuiAlert>
      </Snackbar>

      <Snackbar open={openMessageErr} autoHideDuration={4000} onClose={() => {setOpenMessageErr(false);}}>
        <MuiAlert elevation={6} variant="filled" severity="error">
          Ocorreu um erro ao salvar, tente novamente mais tarde!
        </MuiAlert>
      </Snackbar>
      
    </div>
  );
}

export default DependantRegistration;
