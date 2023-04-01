import * as React from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useContext, useEffect, useState } from 'react';

import Container from '@mui/material/Container';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next/types';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';



import { ClientInfor, ClientVehicle, ServiceSchedulesListProps, TechnicalConsultant } from '@/types/service-schedule';
import { apiCore } from '@/lib/api';


import { useRouter } from 'next/router';

import Title from '@/components/Title';

import List from '@mui/material/List';

import Stack from '@mui/material/Stack';

import { ButtonCenter, ButtonLeft, ButtonRight, ButtonSubmit, DateTimePickerCard, DividerCard, InfoCardName, InfoCardText, ListItemCard, TitleCard } from '@/styles/pages/service-schedules/stylesEdit';
import Skeleton from '@mui/material/Skeleton';
import PrintIcon from '@mui/icons-material/Print';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
// import * as locale from 'date-fns/locale/pt-BR';

import MenuItem from '@mui/material/MenuItem';
import { MoreOptionsButtonSelect } from '@/components/MoreOptionsButtonSelect';
import { CompanyContext } from '@/contexts/CompanyContext';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import 'date-fns/locale/pt-BR';
import { formatDateTimePresentation, formatDateTimezone } from '@/ultis/formatDateTimezone';
dayjs.locale('pt-br') 




const api = new apiCore()

const cardsName = [
  'client',
  'clientVehicle',
  'schedule',
  'technicalConsultant',
]

type isEditSelectedCardType = 'client' | 'clientVehicle' | 'schedule' | 'technicalConsultant' | null

export default function ServiceSchedulesEdit() {
  const [client, setClient] = useState<ClientInfor | null>()
  const [clientVehicle, setClientVehicle] = useState<ClientVehicle | null>()
  const [visitDate, setVisitDate] = useState<Dayjs | null>(null)
  const [technicalConsultant, setTechnicalConsultant] = useState<TechnicalConsultant | null>(null)
  const [technicalConsultantsList, setTechnicalConsultantsList] = useState<TechnicalConsultant[]>([])
  const [isEditSelectedCard, setIsEditSelectedCard] = useState<isEditSelectedCardType>(null)
  const [wasEdited, setWasEdited] = useState(false)
  

  const router = useRouter()

  const { company } = useContext(CompanyContext)

  function handleIsEditSelectedCard(value: isEditSelectedCardType) {
    setIsEditSelectedCard(value)
    setWasEdited(true)
  }

  function handleTechnicalConsultant(id: number) {
    setTechnicalConsultant(prevState => {
      return technicalConsultantsList.filter(c => c.id === id)[0]
    })
  }

  function handleCancelled() {
    setWasEdited(false)
    setIsEditSelectedCard(null)
  }

  function onSave() { 
   const dataFormatted =  {
    code: null,
    promised_date:formatDateTimezone(`${visitDate}`),
    // promised_date: "2023-04-29T16:30:00-04:00",
    technical_consultant_id: technicalConsultant?.id,
    client_id: client?.id,
    client_vehicle_id: clientVehicle?.id,
    company_id: company?.id,
    chasis: clientVehicle?.chassis,
    plate: clientVehicle?.plate,
    claims_service: [
        // {
        //     claim_service_id: 1,
        //     services: [
        //         {
        //             service_id: 1,
        //             price: 50.2,
        //             products: [
        //                 {
        //                     product_id: 1,
        //                     price: '000'
        //                 }
        //             ]
        //         }
        //     ]
        // }
        ]
   }
      console.log(dataFormatted)
    api.update('/service-schedule/' + router.query.id, dataFormatted)
      .then(resp => console.log(resp))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    if (!wasEdited) {
      const { id } = router.query
      console.log(id)
        api.get(`/service-schedule/${id}`)
          .then((response) => {
            console.log(response.data);
  
            const {client, client_vehicle,technical_consultant, promised_date} = response.data.data
            setClient({
              id: client.id,
              name: client.name ?? 'Não informado',
              cpf: client.document ?? 'Não informado',
              email: client.email[0] ?? 'Não informado',
              telefone: client.phone[0] ?? 'Não informado',
              address: client.address ?? 'Não informado'
            })
            
            setClientVehicle({
              id: client_vehicle.id,
              brand: client_vehicle?.vehicle?.model?.brand?.name  ?? 'Não informado',
              chassis: client_vehicle?.chasis  ?? 'Não informado',
              vehicle: client_vehicle?.vehicle?.name  ?? 'Não informado',
              model: `${client_vehicle?.vehicle?.model?.name} - ${client_vehicle.vehicle.model_year}`  ?? 'Não informado',
              color: client_vehicle?.color ?? 'Não informado',
              plate: client_vehicle?.plate ?? 'Não informado' 
            })
            const promisedDate = dayjs(new Date(promised_date))
            // console.log(dayjs(promisedDate))
            setVisitDate(promisedDate)
            
            setTechnicalConsultant({
              id: technical_consultant?.id ?? 'Não informado',
              name: technical_consultant?.name ?? 'Não informado' 
            })
          }).catch((err) => { 
            setClient(null)
            setClientVehicle(null)
            setTechnicalConsultant(null)
                console.error(err)
          })
      
      if (company?.id) { 
        api.get(`/technical-consultant?company_id=${company?.id}`)
        .then(resp => {
          console.log(resp)
          setTechnicalConsultantsList(resp.data.data.map((item: TechnicalConsultant) => ({
            id: item.id,
            name: item.name
          })))
        }).catch((err) => {
          console.log(err)
        }
        )
      }
    }
    
  },[router.query,company?.id,wasEdited])

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Stack direction='row'>
            <Title>Agenda de Serviços</Title>
          </Stack>
        </Grid>
        <Grid item xs={12} md={7} lg={7}>
          <Stack spacing={3}>
               {/* cliente */}
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack direction='row' alignItems="center" justifyContent="space-between">
                <TitleCard >Cliente</TitleCard>
                <MoreOptionsButtonSelect
                  handleIsEditSelectedCard={handleIsEditSelectedCard}
                  typeEdit='client'
                />
              </Stack>
                <DividerCard />
            <List dense={false}>
              
              <ListItemCard>
                  <InfoCardName>
                    Nome:
                  </InfoCardName> {client?.name ? (<InfoCardText >{client?.name}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              <ListItemCard>
                  <InfoCardName>
                    CPF:
                  </InfoCardName> {client?.cpf ? (<InfoCardText>{client?.cpf}</InfoCardText>) : (
                     <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              <ListItemCard>
                <InfoCardName>
                    Telefone:
                  </InfoCardName> {client?.telefone ? (<InfoCardText>{client?.telefone}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              <ListItemCard>
                <InfoCardName>
                    E-mail:
                  </InfoCardName> {client?.email ? (<InfoCardText>{client?.email}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              <ListItemCard>
                <InfoCardName>
                   Endereço:
                  </InfoCardName> {client?.address ? (<InfoCardText>{client?.address}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              
            </List>
            </Paper>
               {/* Veículo */}
              <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
               <Stack direction='row' alignItems="center" justifyContent="space-between">
                <TitleCard >Veículo</TitleCard>
                <MoreOptionsButtonSelect
                  handleIsEditSelectedCard={handleIsEditSelectedCard}
                  typeEdit='clientVehicle'
                />
              </Stack>
                <DividerCard />
            <List dense={false}>
              
              <ListItemCard>
                  <InfoCardName>
                    Marca:
                  </InfoCardName> {clientVehicle?.brand ? (<InfoCardText >{clientVehicle?.brand}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              <ListItemCard>
                  <InfoCardName>
                    Modelo:
                  </InfoCardName> {clientVehicle?.model ? (<InfoCardText>{clientVehicle?.model}</InfoCardText>) : (
                     <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              <ListItemCard>
                <InfoCardName>
                    Veículo:
                  </InfoCardName> {clientVehicle?.vehicle ? (<InfoCardText>{clientVehicle?.vehicle}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              <ListItemCard>
                <InfoCardName>
                    Cor:
                  </InfoCardName> {clientVehicle?.color ? (<InfoCardText>{clientVehicle?.color}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              <ListItemCard>
                <InfoCardName>
                   Chassi:
                  </InfoCardName> {clientVehicle?.chassis ? (<InfoCardText>{clientVehicle?.chassis}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
                </ListItemCard>
                 <ListItemCard>
                <InfoCardName>
                   Placa:
                  </InfoCardName> {clientVehicle?.plate ? (<InfoCardText>{clientVehicle?.plate}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              
            </List>
            </Paper>
            
          </Stack>
        </Grid>
        
        <Grid item xs={12} md={5} lg={5}>
          <Stack spacing={2}>
            <Stack spacing={2} direction='row' display='flex' justifyContent='center' >
              <ButtonLeft >Listar Checklists</ButtonLeft>
              <ButtonCenter ><PrintIcon /></ButtonCenter>
              <ButtonRight startIcon={<AddCircleOutlineIcon/>}>Novo</ButtonRight>
            </Stack>
            <Stack spacing={2} direction='row' display='flex' justifyContent='center' >
              <ButtonLeft >Listar Orçamentos</ButtonLeft>
              <ButtonCenter ><PrintIcon /></ButtonCenter>
              <ButtonRight startIcon={<AddCircleOutlineIcon/>}>Novo</ButtonRight>
            </Stack>
            {/* Agendamento */}
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack direction='row' alignItems="center" justifyContent="space-between">
                <TitleCard >AGENDAMENTO</TitleCard>
                <MoreOptionsButtonSelect
                  handleIsEditSelectedCard={handleIsEditSelectedCard}
                  typeEdit='schedule'
                />
              </Stack>
                <DividerCard />
              <List dense={false}>
              
              <ListItemCard>
                  <InfoCardName>
                    Número do atendimento:
                  </InfoCardName> {router.query.id ? (<InfoCardText >{router.query.id}</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
              </ListItemCard>
              <ListItemCard>
                  <InfoCardName>
                    Data da visita:
                  </InfoCardName>
                 { isEditSelectedCard === 'schedule' &&
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="pt-br"
                  >
                    <DateTimePickerCard
                      format="DD/MM/YYYY HH:mm"
                      slotProps={{ textField: { size: 'small' } }}
                      value={visitDate}
                      // readOnly={isEditSelectedCard !== 'schedule'}

                      onChange={(newValue: any) => {
                        // console.log(newValue)
                        setVisitDate(newValue)
                      }}
                    />
                    </LocalizationProvider>
                  }
                  {
                    isEditSelectedCard !== 'schedule' && (
                      <ListItemCard>
                        {visitDate ? (<InfoCardText>{formatDateTimePresentation(`${visitDate}`)}</InfoCardText>) : (
                            <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                          )}
                      </ListItemCard>
                    )
                  }
              </ListItemCard>
              
              </List>
              
            </Paper>
          <Grid item xs={12} md={5} lg={5}
              alignSelf='flex-end'
            >
              
                <Stack
                  direction="row"
                  alignSelf='flex-end'
                  spacing={2}
                >
                {(wasEdited &&isEditSelectedCard === 'schedule')  && (
                  <ButtonSubmit
                    variant="contained"
                    size='small'
                    onClick={() => onSave()}
                  >
                    save
                  </ButtonSubmit>
                )}
                { (wasEdited && isEditSelectedCard === 'schedule') &&
                  (<ButtonSubmit
                      variant="contained"
                      size='small'
                      onClick={() => handleCancelled()}
                    >
                    cancelar
                  </ButtonSubmit>
                  )
                }
                </Stack>
            </Grid>
              <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
              <Stack direction='row' alignItems="center" justifyContent="space-between">
                <TitleCard >Consultor técnico</TitleCard>
                <MoreOptionsButtonSelect
                  handleIsEditSelectedCard={handleIsEditSelectedCard}
                  typeEdit='technicalConsultant'
                />
              </Stack>
                <DividerCard />
            <List dense={false}>
              
              <ListItemCard>
                
                  <InfoCardName>
                    Nome:
                  </InfoCardName> {isEditSelectedCard !== 'technicalConsultant' && technicalConsultant?.name
                    ? (<InfoCardText >{technicalConsultant?.name}</InfoCardText>)
                    : (
                     isEditSelectedCard !== 'technicalConsultant' && (<InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>)
                    )}
                  {isEditSelectedCard === 'technicalConsultant' && (
                    <Box width="100%">

                      <TextField
                        id="standard-select-currency"
                        select
                        sx={{
                          width: '100%',
                        }}
                        value={technicalConsultant?.id}
                        variant="standard"
                        onChange={(e) => handleTechnicalConsultant(parseInt(e.target.value))} 
                      >
                      {technicalConsultantsList.map((option) => (
                          <MenuItem key={option.id + option.name} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  )}
              </ListItemCard>
              <ListItemCard>
                  <InfoCardName>
                    Código consultor:
                  </InfoCardName> {technicalConsultant?.id ? (<InfoCardText>{technicalConsultant?.id }</InfoCardText>) : (
                    <InfoCardText width='100%'><Skeleton variant="text" sx={{ fontSize: '1rem', lineHeight: 1.5 }} width='100%' /></InfoCardText>
                  )}
          
              </ListItemCard>
              </List>
            </Paper>
            <Grid item xs={12} md={5} lg={5}
              alignSelf='flex-end'
            >
              
                <Stack
                  direction="row"
                  alignSelf='flex-end'
                  spacing={2}
                >
                {(wasEdited && isEditSelectedCard === 'technicalConsultant') && (
                  <ButtonSubmit
                    variant="contained"
                    size='small'
                    onClick={() => onSave()}
                  >
                    save
                  </ButtonSubmit>
                )}
                { (wasEdited && isEditSelectedCard === 'technicalConsultant') &&
                  (<ButtonSubmit
                      variant="contained"
                      size='small'
                      onClick={() => handleCancelled()}
                    >
                    cancelar
                  </ButtonSubmit>
                  )
                }
                </Stack>
            </Grid>
            </Stack>
          </Grid>

        </Grid>
    </Container>
    
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {

const session = await getSession(ctx)

  if (!session?.user?.token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  return {
    props: {
    }, 
  }
}