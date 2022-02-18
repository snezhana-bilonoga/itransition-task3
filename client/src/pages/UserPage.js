import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const TablePage = () => {
    const { request } = useHttp();
    const { token } = useContext(AuthContext);
    const history = useHistory();
    const auth = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    const [checked, setChecked] = useState({
        MasterCheck: false,
        CheckedList: [],
    });

    const fetchUsers = useCallback(async () => {
        try {
            const fetched = await request('/api/users', 'GET', null, {
                Authorization: `Bearer ${token}`,
            });
            setUsers(fetched);
        } catch (e) {}
    }, [token, request]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const logoutHandler = (event) => {
        event.preventDefault();
        auth.logout();
        history.push('/');
    };

    const onMasterCheck = (event) => {
        setChecked({
            MasterCheck: event.target.checked,
            CheckedList: event.target.checked
                ? [...users].map((user) => user._id)
                : [],
        });
    };

    const onUserCheck = (event, userId) => {
        const checkedList = [...checked.CheckedList];
        const userIds = users.map((user) => user._id);

        const isAllChecked =
            event.target.checked &&
            userIds.every((_userId) =>
                [...checkedList, userId].includes(_userId)
            );

        setChecked({
            MasterCheck: isAllChecked,
            CheckedList: event.target.checked
                ? [...checkedList, userId]
                : [...checkedList].filter((_userId) => _userId !== userId),
        });
    };

    const blockUsers = () => {
        try {
            checked.CheckedList.forEach(async (userId) => {
                await request('/api/users/block/' + userId, 'POST', null, {
                    Authorization: `Bearer ${token}`,
                });
            });

            if (checked.CheckedList.includes(auth.userId)) {
                auth.logout();
                history.push('/');
            } else {
                fetchUsers();
            }
        } catch (e) {}
    };

    const unblockUsers = () => {
        try {
            checked.CheckedList.forEach(async (userId) => {
                await request('/api/users/unblock/' + userId, 'POST', null, {
                    Authorization: `Bearer ${token}`,
                });
            });

            fetchUsers();
        } catch (e) {}
    };

    const deleteUsers = () => {
        try {
            checked.CheckedList.forEach(async (userId) => {
                await request('/api/users/delete/' + userId, 'POST', null, {
                    Authorization: `Bearer ${token}`,
                });
            });

            if (checked.CheckedList.includes(auth.userId)) {
                auth.logout();
                history.push('/');
            } else {
                fetchUsers();
            }
        } catch (e) {}
    };
    return (
        <div>
            <nav>
                <div
                    className="nav-wrapper blue darken-1"
                    style={{ padding: '0 2rem' }}
                >
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            <button
                                type="button"
                                className="waves-effect waves-light btn-small"
                                onClick={blockUsers}
                            >
                                Block
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="waves-effect waves-light btn-small"
                                onClick={unblockUsers}
                            >
                                Unblock
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="waves-effect waves-light btn-small"
                                onClick={deleteUsers}
                            >
                                Delete
                            </button>
                        </li>
                        <li>
                            <a href="/" onClick={logoutHandler}>
                                Log off
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="centered" style={{ marginTop: 100 }}>
                <table>
                    <thead>
                        <tr>
                            <th>
                                {' '}
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={checked.MasterCheck}
                                        onChange={onMasterCheck}
                                    />
                                    <span>Select\Deselect all</span>
                                </label>
                            </th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Date of registration</th>
                            <th>Date of last login</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key={user._id}>
                                    <th>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={checked.CheckedList.includes(
                                                    user._id
                                                )}
                                                onChange={(e) =>
                                                    onUserCheck(e, user._id)
                                                }
                                            />
                                            <span></span>
                                        </label>
                                    </th>
                                    <td>{user._id}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.dateRegistration}</td>
                                    <td>{user.dateLastLogin}</td>
                                    <td>
                                        {user.isBlocked
                                            ? 'Blocked'
                                            : 'Not Blocked'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
