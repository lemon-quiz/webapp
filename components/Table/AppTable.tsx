import {
  Table,
  Paper, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TablePagination
} from "@material-ui/core";
import React, {
  ReactElement,
  ReactNode,
} from "react";
import {PaginatedResources} from "../../module/PaginatedResources";
import {useRouter} from "next/router";
import {makeStyles} from "@material-ui/styles";
import HeaderSearch from "./Headers/HeaderSearch";
import Header from "./Headers/Header";

const generateChildren = (children: ReactNode, record: any): ReactNode => {
  return React.Children.map(children, (child): ReactElement => {
    if (React.isValidElement<ReactElement>(child)) {
      return React.cloneElement<any>(child, {record, value: record});
    }

    return child as React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  });
}

const generateHeaders = (children: ReactNode): any => {
  return React.Children.map<ReactElement, any>(children, (child) => {
    if (React.isValidElement<any>(child)) {
      if (child?.props?.searchable) {
        return <HeaderSearch label={child.props.label}
                             column={child.props.column}
                             sortable={child.props.sortable}/>;
      }

      if (typeof child?.props?.label !== undefined) {
        return <Header label={child.props.label}
                       column={child.props.column}
                       sortable={child.props.sortable}/>;
      }
    }

    return <TableCell/>;
  });
}

export interface AppTableInterface<T = any> {
  children: ReactNode;
  resource: PaginatedResources<T>;
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function AppTable<T = any>({children, resource}: AppTableInterface<T>) {
  const classes = useStyles();
  const router = useRouter();

  const handlePageChange = (_event: any, page: number) => {
    const {query: currentQuery, pathname} = router;
    const query = {...currentQuery, page: page + 1};
    router.push({
      pathname,
      query
    }, undefined, {shallow: true});
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {generateHeaders(children)}
            </TableRow>
          </TableHead>
          <TableBody>
            {resource && (resource.data).map((record: any, index: number): ReactElement => {
              return (
                <TableRow key={record?.id || index}>
                  {generateChildren(children, record)}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15, 25, 50, 100]}
        component="div"
        count={resource.total}
        rowsPerPage={resource.per_page}
        page={resource.current_page - 1}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={() => {
        }}
      />
    </>
  );
}
