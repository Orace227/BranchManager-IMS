import { useState } from 'react';
import { filter } from 'lodash';
import {
  Card,
  Table,
  Stack,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  Checkbox
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { useEffect } from 'react';
import React from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const TABLE_HEAD = [
  { id: 'EmployeeNo', label: 'Employee ID', alignRight: false },
  { id: 'Name', label: 'Name', alignRight: false },
  { id: 'Designation', label: 'Designation', alignRight: false },
  { id: 'Dept', label: 'Department', alignRight: false },
  { id: 'Email', label: 'Email', alignRight: false },
  { id: 'mobileNo', label: 'Mobile No.', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false }
];

export default function Employees() {
  // const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [USERLIST, setUserlist] = useState([]);

  const fetchCustomers = async () => {
    const promise = new Promise((resolve, reject) => {
      axios
        .get(`/GetEmployees?isConfirmed=pending`, {
          withCredentials: true // Include credentials (cookies) with the request
        })
        .then((response) => {
          console.log(response);
          const orderData = response.data.findEmployees;
          console.log(orderData);
          setUserlist(orderData);
          //   toast.success('Order Fetched Successfully!');

          resolve(orderData);
        })
        .catch((error) => {
          toast.error('Failed to Fetch Order. Please try again later.');
          console.error('Error fetching Order:', error);
          reject(error);
        });
    });

    toast.promise(promise, {
      loading: 'Fetching Confirmed Order...',
      success: 'Confirmed Order fetched successfully!!',
      error: 'Failed to fetch Confirmed Order!!!'
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // const handleCloseMenu = () => {
  //   setOpen(null);
  // };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // If the checkbox is checked, select all items
      const newSelecteds = USERLIST.map((n) => n.empId);
      setSelected(newSelecteds);
    } else {
      // If the checkbox is unchecked, clear the selection
      setSelected([]);
    }
  };

  const handleClick = (event, empId) => {
    const selectedIndex = selected.indexOf(empId);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If the item is not selected, add it to the selection
      newSelected = [...selected, empId];
    } else if (selectedIndex >= 0) {
      // If the item is selected, remove it from the selection
      newSelected = selected.filter((id) => id !== empId);
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleAcceptEmployee = async (row) => {
    try {
      const user = USERLIST.find((user) => user.empId == row.empId);
      console.log(user);
      const isDelete = window.confirm('Are you sure you want to approve request of Employee having name ' + user.username);
      if (isDelete) {
        user.isConfirmed = 'approved';
        const deletedCustomer = await axios.post(`/UpdateEmployee`, user, {
          withCredentials: true // Include credentials (cookies) with the request
        });
        if (deletedCustomer) {
          toast.success('Employee request approved successfully!!');
          window.location.reload();
        }
      }
    } catch (err) {
      toast.error('An error occurs during the employee request approval process!!');

      console.log({ error: err });
    }
  };

  const handleRejectEmployee = async (row) => {
    try {
      const user = USERLIST.find((user) => user.empId == row.empId);
      console.log(user);
      const isDelete = window.confirm('Are you sure you want to cancel request of Employee having name ' + user.username);
      if (isDelete) {
        user.isConfirmed = 'declined';
        const deletedCustomer = await axios.post(`/UpdateEmployee`, user, {
          withCredentials: true 
        });
        if (deletedCustomer) {
          toast.success('Employee request canceled successfully!!');
          window.location.reload();
        }
      }
    } catch (err) {
      toast.error('An error occurs during the employee cancelation process!!');

      console.log({ error: err });
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={1}>
          <Typography variant="h2" gutterBottom>
            Authorize Employee Registration
          </Typography>
        </Stack>
        <Toaster />

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} placeholder="Employee" />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .reverse()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      // console.log(row);
                      const { empId, username, dept, designation, mNumber, email } = row;
                      const selectedUser = selected.indexOf(empId) !== -1;
                      // const createdDate = new Date(createdAt);
                      // const formattedDate = `${createdDate.getDate()}-${createdDate.getMonth() + 1}-${createdDate.getFullYear()}`;
                      return (
                        <>
                          <TableRow hover key={empId} tabIndex={-1} role="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, empId)} />
                            </TableCell>
                            <TableCell align="left">{empId}</TableCell>

                            <TableCell align="left">{username}</TableCell>
                            <TableCell align="left">{designation}</TableCell>
                            <TableCell align="left">{dept}</TableCell>
                            <TableCell align="left">{email}</TableCell>
                            <TableCell align="left">{mNumber}</TableCell>
                            <TableCell align="left">
                              <IconButton
                                size="large"
                                color="inherit"
                                className="bg-green-300 hover:bg-green-500"
                                onClick={() => {
                                  handleAcceptEmployee(row);
                                }}
                              >
                                <Iconify icon={'eva:checkmark-outline'} /> {/* Accept icon */}
                              </IconButton>
                              <IconButton
                                size="large"
                                className="bg-red-300 hover:bg-red-500 ml-2"
                                color="inherit"
                                onClick={() => {
                                  handleRejectEmployee(row);
                                }}
                              >
                                <Iconify icon={'eva:close-outline'} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                  {USERLIST.length === 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            No Any Employee Request
                          </Typography>
                          <Typography variant="body2">There are currently no No any employee request available.</Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
