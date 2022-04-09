import React from 'react';
import 'antd/dist/antd.css';
import { Table, Button, Spin, notification } from 'antd';
import Sidebar from '../Sidebar';
import dateFormat from "dateformat";
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const columns = [
    {
        title: 'First Name',
        key: 'firstName',
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
        render: (record) => (
            <>
                {record.firstName}
            </>
        ),
    },
    {
        title: 'Last Name',
        key: 'lastName',
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
        render: (record) => (
            <>
                {record.lastName}
            </>
        ),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
        title: 'Date',
        key: 'createdAt',
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        render: (record) => (
            <>
                {dateFormat(record.createdAt, "yyyy/mm/dd, h:MM:ss tt")}
            </>
        )
    },
    {
        title: 'Subject',
        dataIndex: 'subject',
        sorter: (a, b) => a.subject.localeCompare(b.subject),
    },
    {
        title: 'Message',
        dataIndex: 'message',
        // sorter: (a, b) => a.message - b.message,
    }
];

// const expandable = { expandedRowRender: record => <p>{record.description}</p> };
const showHeader = true;
const pagination = { position: 'bottom' };

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
    }),
};
class Contact extends React.Component {
    state = {
        bordered: false,
        loading: false,
        pagination,
        size: 'small',
        // expandable,
        title: undefined,
        showHeader,
        rowSelection: {},
        scroll: undefined,
        hasData: true,
        tableLayout: undefined,
        top: 'none',
        bottom: 'bottomRight',
        search: '',
        bulkActions: '',
        filter: '',
        data: [],
        load: false,
        isModalVisible: false,
        errorMessage: null,
        selectionType: 'checkbox'
    };

    onHandleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }
    fetchData = async (value, keyword) => {
        try {
            const res = await Promise.all([
                axios.get("contacts"),
            ]);
            console.table(res[0].data.contact)
            this.setState({
                data: res[0].data.contact,
                load: true
            })
        } catch {
            this.setState({
                errorMessage: "Something Went Wrong"
            })
        }
    };

    componentDidMount() {
        this.fetchData();
    }
    showModal = () => {
        this.setState({ isModalVisible: true })
    }
    handleOk = () => {
        this.setState({ isModalVisible: false })
    };
    handleCancel = () => {
        this.setState({ isModalVisible: false })
    }

    handleRowSelectionChange = enable => {
        this.setState({ rowSelection: enable ? {} : undefined });
    };

    handleYScrollChange = enable => {
        this.setState({ yScroll: enable });
    };

    handleDataChange = hasData => {
        this.setState({ hasData });
    };

    render() {
        const { xScroll, yScroll, ...state } = this.state;

        const scroll = {};
        if (yScroll) {
            scroll.y = 240;
        }
        if (xScroll) {
            scroll.x = '100vw';
        }

        const tableColumns = columns.map(item => ({ ...item, ellipsis: state.ellipsis }));
        if (xScroll === 'fixed') {
            tableColumns[0].fixed = true;
            tableColumns[tableColumns.length - 1].fixed = 'right';
        }

        return (
            <>
                <Sidebar />
                <div className='content pt-5'>
                    <div className='col-11'>
                        <div className='displayFlex '>
                            <div className='displayFlex ml-2'>
                                <h6 className='mr-auto'>Contact Forms</h6>
                            </div>
                            <div className='displayFlex'>
                                <input type="text" className='lightBlue border-0 outline' value={state.search} onChange={this.onHandleChange} name='search' placeholder='Search' />
                                <Button className="bgBlue mx-1" size={'small'}> Search </Button>
                            </div>
                        </div>
                        <div className='row'>
                            <button className='btn' >All ({this.state?.data?.length}) </button>
                            <button className='btn'>| </button>
                            <button className='btn' >Spam </button>
                        </div>
                        <div className='displayFlex mt-3'>
                            <div className='displayFlex'>
                                <select value={state.bulkActions} onChange={this.onHandleChange} name='bulkActions' className='blue Radius2'>
                                    <option value="" className='blue'>Bulk Actions</option>
                                    <option value="saab" className='blue'>Delete</option>
                                </select>
                                <Button className="bgBlue mx-2" size={'small'}> Apply </Button>
                            </div>
                            <div className='displayFlex'>
                                <Button className="border-0 mx-2" size={'small'}> Filter </Button>
                                <select value={state.filter} onChange={this.onHandleChange} name='filter' className='blue Radius2'>
                                    <option value="" className='blue'>Select Period</option>
                                    <option value="saab" className='blue'>1 Day</option>
                                    <option value="opel" className='blue'>7 Days</option>
                                    <option value="audi" className='blue'>30 Days</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <Table
                            {...this.state}
                            rowKey="_id"
                            rowSelection={{
                                type: state.selectionType,
                                ...rowSelection,
                            }}
                            pagination={{ position: [this.state.top, this.state.bottom] }}
                            columns={tableColumns}
                            dataSource={state.hasData ? this.state.data : null}
                            loading={{ indicator: <div><Spin indicator={antIcon} /></div>, spinning: !this.state.load }}
                            scroll={scroll} className="table-responsive" />
                    </div>
                </div>

                {this.state.errorMessage !== null &&
                    notification['error']({
                        message: 'Error',
                        description: this.state.errorMessage,
                        placement: 'bottomLeft'
                    })
                }
            </>
        );
    }
}
export default Contact;