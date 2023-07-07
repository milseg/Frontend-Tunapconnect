/* eslint-disable no-unused-vars */
import * as React from "react";
import { useForm } from "react-hook-form";
import { useContext, useState, useMemo, useEffect } from "react";

import Container from "@mui/material/Container";

import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

import { ButtonAdd, ButtonIcon } from "./style";

import { api, apiB } from "@/lib/api";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ActionDeleteConfirmations } from "@/helpers/ActionConfirmations";
import { useRouter } from "next/router";
import { TableApp } from "@/components/TableApp";
import { listBreadcrumb } from "@/components/HeaderBreadcrumb/types";
import HeaderBreadcrumb from "@/components/HeaderBreadcrumb";

import { useQuery } from "react-query";
import Skeleton from "@mui/material/Skeleton";
import { ServiceScheduleContext } from "@/contexts/ServiceScheduleContext";
import ButtonFilterSelect from "./components/ButtonFilterSelect";
import { Stack } from "@mui/system";
// import FilterListIcon from '@mui/icons-material/FilterList'
import { useMediaQuery, useTheme } from "@mui/material";
import { formatMoneyPtBR } from "@/ultis/formatMoneyPtBR";
import { QuotationResponseType } from "@/types/quotation";
import { QuotationsContext } from "@/contexts/QuotationContext";
import { GroupsType } from "@/types/groups";
import { GroupContext } from "@/contexts/GroupsContext";

type SearchFormProps = {
  search: string;
};

type DataFetchProps = {
  paginate: {
    current_page: number;
    total_pages: number;
    total_results: number;
  };
  GroupsListAllData: GroupsType[];
  GroupsList: GroupsType[];
};

type filterValuesProps = {
  date: {
    dateStart: string | null;
    dateEnd: string | null;
  };
};

const HeaderBreadcrumbData: listBreadcrumb[] = [
  {
    label: "Tunap",
    href: "/groups",
  },
  {
    label: "Grupos",
    href: "/groups",
  },
];

export default function GroupsList() {
  const [pages, setPages] = useState<{
    next: boolean;
    previous: boolean;
  }>({ next: true, previous: true });
  const [filterValues, setFilterValues] = useState<filterValuesProps>();
  const [isMobile, setIsMobile] = useState(false);

  const { setGroup } = useContext(GroupContext);

  const router = useRouter();

  const theme = useTheme();
  const isWeb = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (!isWeb) {
      if (!isMobile) {
        setIsMobile(true);
      }
    } else {
      setIsMobile(false);
    }
  }, [isWeb]);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      search: "",
    },
  });

  async function onSubmitSearch(data: SearchFormProps) {
    await router.push(
      `/groups?${
        data.search ? "&search=" + data.search : ""
      }
     `
    );
  }

  const handleDelete = (id: number) => {
    refetch();
  };

  let url = `/groups`;

  if (router.query.limit) {
    url += `&limit=${router.query.limit}`;
  }

  if (router.query.current_page) {
    url += `&current_page=${router.query.current_page}`;
  }

  if (router.query.search) {
    url += `&search=${router.query.search}`;
  }

  // if (router.query.promised_date_min) {
  //   url += `&promised_date_min=${filterValues?.date.dateStart}`
  // }
  // if (router.query.promised_date_max) {
  //   url += `&promised_date_max=${filterValues?.date.dateEnd}`
  // }
  // if (router.query.orderby) {
  //   url += '&orderby=promised_date'
  // }

  async function handleFilterValues(values: filterValuesProps) {
    setFilterValues(values);
    if (values?.date.dateStart) {
      url += `&promised_date_min=${values?.date.dateStart}`;
    }
    if (values?.date.dateEnd) {
      url += `&promised_date_max=${values?.date.dateEnd}`;
    }
    url += "&orderby=promised_date";

    await router.push(url);
  }
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Número",
        headerClassName: "super-app-theme--header",
        width: 100,
        type: "number",
        align: "center",
        sortable: false,
      },
      {
        field: "name",
        headerName: "Nome",
        headerClassName: "super-app-theme--header",
        flex: 1,
        maxWidth: 300,
        minWidth: 200,
        align: "left",
        sortable: false,
      },
      {
        field: "created_at",
        headerName: "Criado em",
        headerClassName: "super-app-theme--header",
        width: 300,
        type: "text",
        align: "left",
        sortable: false,
      },
      {
        field: "updated_at",
        headerName: "Atualizado em",
        headerClassName: "super-app-theme--header",
        width: 300,
        type: "text",
        align: "left",
        sortable: false,
      },

      {
        field: "action",
        headerName: "Ação",
        headerClassName: "super-app-theme--header",
        sortable: false,
        width: 120,
        align: "left",
        renderCell: (params: GridRenderCellParams) => {
          const onClick = (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            const id = params.id;
            ActionDeleteConfirmations(id as number, handleDelete, "/groups/");
          };
          return (
            <IconButton
              aria-label="search"
              color="warning"
              onClick={onClick}
              sx={{ marginLeft: 1, color: "red" }}
            >
              <Delete />
            </IconButton>
          );
        },
      },
    ],
    []
  );

  const {
    data: rows,
    isSuccess,
    // isInitialLoading,
    // isLoading,
    // isFetched,
    refetch,
    isFetching,
  } = useQuery<DataFetchProps>(
    ["groups-list", url],
    () => {
      return apiB.get("/grupos").then((response) => {
        const resp = response.data.groups.map((data: GroupsType) => {
          return {
            id: data?.id_group,
            created_at: data?.created_at,
            name: data?.name,
            updated_at: data?.updated_at,
          };
        });

        if (response.data.total_pages === 1)
          setPages({
            next: false,
            previous: false,
          });
        if (!router.query.current_page) {
          if (response.data.current_page === 1) {
            setPages((prevState) => ({ ...prevState, previous: false }));
          }
        }

        return {
          paginate: {
            current_page: response.data.current_page,
            total_pages: response.data.total_pages,
            total_results: response.data.total_groups,
          },
          GroupsList: resp,
          GroupsListAllData: response.data.groups,
        };
      });
    },

    {
      enabled: !!url,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );

  function handlePages(nextPage: any): void {
    let newCurrent_page = 1;
    const actualCurrent_page = router.query.current_page
      ? parseInt(router.query.current_page as string)
      : 1;

    if (!rows?.paginate) {
      return;
    }

    if (nextPage === "next") {
      newCurrent_page = actualCurrent_page + 1;
      if (newCurrent_page > rows?.paginate.total_pages) {
        return;
      }
    }
    if (nextPage === "back") {
      newCurrent_page = actualCurrent_page - 1;
      if (newCurrent_page < 1) {
        return;
      }
    }

    const newUrlPagination = `/groups?${
      router.query.search ? "&search=" + router.query.search : ""
    }${"&current_page=" + newCurrent_page}${
      router.query.limit ? "&limit=" + router.query.limit : ""
    }`;

    router.push(newUrlPagination);
  }

  async function handleSetServiceSchedule(idSelected: number) {
    const filterSelected = rows?.GroupsListAllData.filter(
      (i) => i.id_group === idSelected
    )[0];

    if (filterSelected) {
      setGroup(filterSelected);
    }
    // await router.push(`/service-schedule/${idSelected}`)
  }

  useEffect(() => {
    async function refetchUrl() {
      if (router.query.search) {
        setValue("search", router.query.search as string);
      } else {
        setValue("search", "");
      }

      if (router.query.current_page) {
        const currentPage = parseInt(router.query.current_page as string);
        if (rows?.paginate) {
          if (currentPage >= rows?.paginate.total_pages) {
            setPages({
              next: false,
              previous: true,
            });
          } else {
            if (pages.next === false) {
              setPages((prevState) => ({ ...prevState, next: true }));
            }
          }
          if (currentPage <= 1) {
            setPages({
              next: true,
              previous: false,
            });
          } else {
            if (pages.previous === false) {
              setPages((prevState) => ({ ...prevState, previous: true }));
            }
          }
        }
      }

      await refetch();
    }
    refetchUrl();
  }, [router]);
  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <HeaderBreadcrumb data={HeaderBreadcrumbData} title="Grupos" />
            {!isMobile ? (
              <ButtonAdd
                size="large"
                variant="contained"
                sx={{ alignSelf: "flex-end", marginRight: "20px" }}
                startIcon={<AddCircleOutlineIcon />}
                onClick={async () => {
                  // await router.push(`/service-schedule/create`)
                }}
                // disabled
              >
                novo
              </ButtonAdd>
            ) : (
              <ButtonIcon
                sx={{ alignSelf: "flex-end", marginRight: "20px" }}
                onClick={async () => {
                  // await router.push(`/service-schedule/create`)
                }}
              >
                <AddCircleOutlineIcon />
              </ButtonIcon>
            )}
          </Stack>
          {/* <Grid
                item
                xs={}
                // md={12}
                // lg={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              > */}

          {/* </Grid> */}
        </Grid>

        <Grid item xs={12} sx={{ marginBottom: 2 }}></Grid>
        <Grid item xs={12} sx={{ marginBottom: 4 }}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "row" }}>
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmitSearch)}
                  sx={{ flexWrap: "nowrap", display: "flex", flex: 1 }}
                >
                  <TextField
                    label="Procura"
                    id="outlined-size-small"
                    size="small"
                    sx={{ flex: 1, width: "100%" }}
                    {...register("search")}
                  />

                  <ButtonIcon
                    type="submit"
                    aria-label="search"
                    color="primary"
                    sx={{ marginLeft: 1 }}
                  >
                    <SearchIcon />
                  </ButtonIcon>
                </Box>
                <Box>
                  <ButtonFilterSelect
                    handleFilterValues={handleFilterValues}
                    isMobile={isMobile}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          {!isFetching ? (
            <TableApp
              columns={columns}
              rowsData={isSuccess ? rows.GroupsList : []}
              handlePages={handlePages}
              pages={pages}
              loading={isFetching}
              companyId={null}
              handleSetServiceSchedule={handleSetServiceSchedule}
            />
          ) : (
            <Skeleton variant="rounded" sx={{ width: "100%" }} height={150} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

GroupsList.auth = true;
