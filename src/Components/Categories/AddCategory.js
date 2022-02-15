import React from 'react';
import 'antd/dist/antd.css';
import { Table, Button, Space, Popconfirm, message, Spin, notification } from 'antd';
import Sidebar from '../Sidebar';
import { ReactComponent as DeleteIcon } from '../../assests/delete.svg';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const columns = [
    {
        title: 'Cateogories',
        dataIndex: 'name',
        sorter: (a, b) => a.name - b.name,
    },
    {
        title: 'Post Counts',
        dataIndex: 'postCount',
        sorter: (a, b) => a.postCount - b.postCount,
    },
    {
        title: 'Action',
        key: 'action',
        sorter: false,
        render: (record) => (
            <>
                <Space size="middle">
                    <a href={"/category/edit/" + record._id}> <Button className=' bgBlue' size={'small'}> Edit </Button> </a>
                    <Popconfirm title="Sure to delete?" onConfirm={() => (DeleteCategory(record._id))}>
                        <Button className='' size={'small'} type='primary' danger> <DeleteIcon /> </Button> </Popconfirm>
                </Space>
            </>
        ),
    },
];

const DeleteCategory = (id) => {
    const link = "category/" + id
    axios.delete(link)
        .then((res) => {
            if (res.data.success) {
                message.success('Category Deleted Successfully')
                window.location = "/categories"
            }
        }).catch(function (error) {
            console.log(error)
        });
}
// const expandable = { expandedRowRender: record => <p>{record.description}</p> };
const showHeader = true;
const pagination = { position: 'bottom' };

class AddCategory extends React.Component {
    formRef = React.createRef();
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
        name: '',
        slug: '',
        data: [],
        load: false,
        errorMessage: null
    };

    onHandleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        })
    }
    validate() {
        let nameError = "";
        let slugError = "";
        if (!this.state.name) {
            nameError = "Name is required";
        }
        if (!this.state.slug) {
            slugError = "Slug field is required";
        }
        if (nameError || slugError) {
            this.setState({ nameError, slugError });
            return false;
        }
        return true;
    }
    fetchData = async (value, keyword) => {
        try {
            const res = await Promise.all([
                // axios.get("category"),
                value === "published" ? axios.get("category/status/published")
                    : value === "draft" ? axios.get("category/status/drafted")
                        : value === "trashed" ? axios.get("category/status/trashed")
                            : value === "search" ? axios.get(`category?keyword=${keyword}`)
                                : axios.get("category"),
            ]);
            this.setState({
                data: (value === "published" ? res[0].data.categoriesFound
                    : value === "draft" ? res[0].data.categoriesFound
                        : value === "trashed" ? res[0].data.categoriesFound
                            : value === "search" ? res[0].data.categories
                                : res[0].data.categories),
                load: true
            })
        } catch {
            // throw Error("Promise");
            // message.error("Something went wrong")
            this.setState({ errorMessage: "Something went Wrong" })
        }
    };

    componentDidMount() {
        this.fetchData();
    }

    SubmitCategory = () => {
        if (this.validate()) {
            const link = "category"
            axios.post(link,
                {
                    name: this.state.name,
                    slug: this.state.slug
                })
                .then((res) => {
                    if (res.data.success) {
                        message.success('Category Added Successfully')
                        window.location = "/categories"
                    }
                    else{
                        message.error(res.data.message)
                    }
                })
        }
    }

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
                    <div className='displayFlex ml-2'>
                        <h6 className='mr-auto font-weight-bold'>Categories</h6>
                    </div>
                    <div className='row '>
                        <div className='col-md-4 ml-lg-2 pt-5'>
                            <h6 className=' font-weight-bold'>Add Category</h6>
                            <div className='mt-2'>
                                <div className='px-0'>
                                    <div className='col-md-12 mt-2 px-0'>
                                        <input placeholder="Name" name="name"
                                         value={state.name} 
                                         onChange={this.onHandleChange} 
                                         className="col-12 fillColor px-md-5 px-1 py-2" />
                                         <span className="text-danger">{this.state.nameError}</span>
                                        <p className='mt-1'>The name is how it appears on your site.</p>
                                    </div>

                                    <div className='col-md-12 mt-2 px-0'>
                                        <input placeholder="Slug"
                                         name="slug"
                                          value={state.slug} 
                                          onChange={this.onHandleChange}
                                           className="col-12 fillColor px-md-5 px-1 py-2" />
                                           <span className="text-danger">{this.state.slugError}</span>
                                        <p className='mt-1'>The “slug” is the URL-friendly version of the name. It is
                                            usually all lowercase and contains only letters, numbers,
                                            and hyphens.</p>
                                    </div>
                                    <div className='col-md-12 mt-2 px-0'>
                                        <Button size="middle" type="primary" htmlType="submit" onClick={this.SubmitCategory} className=" Radius8 ">
                                            Add Category
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-7 mx-auto'>
                            <div className='row'>
                                <button className='btn' onClick={() => this.fetchData()}>All </button>
                                <button className='btn'>| </button>
                                <button className='btn' onClick={() => this.fetchData("published")}>Published </button>
                                <button className='btn'>| </button>
                                <button className='btn' onClick={() => this.fetchData("draft")}>Draft </button>
                                <button className='btn'>| </button>
                                <button className='btn' onClick={() => this.fetchData("trashed")}>Trashed </button>
                            </div>
                            <div className='row mt-3'>
                                <div className='mr-auto'>
                                    <div className='displayFlex  '>
                                        <select value={state.bulkActions} onChange={this.onHandleChange} name='bulkActions' className='blue Radius2 outline'>
                                            <option value="" className='blue'>Bulk Actions</option>
                                            <option value="saab" className='blue'>Saab</option>
                                            <option value="opel" className='blue'>Opel</option>
                                            <option value="audi" className='blue'>Audi</option>
                                        </select>
                                        <Button className="bgBlue mx-2" size={'small'}> Apply </Button>
                                    </div>
                                </div>
                                <div className='ml-auto'>
                                    <div className='displayFlex'>
                                        <input type="text" className='lightBlue border-0 outline' value={state.search} onChange={this.onHandleChange} name='search' placeholder='Search' />
                                        <Button className="bgBlue mx-1" size={'small'} onClick={() => this.fetchData("search", state.search)}> Search </Button>
                                    </div>
                                </div>

                            </div>
                            <div className='mt-2'>
                                <Table
                                    {...this.state}
                                    pagination={{ position: [this.state.top, this.state.bottom] }}
                                    columns={tableColumns}
                                    dataSource={state.hasData ? this.state.data : null}
                                    loading={{ indicator: <div><Spin indicator={antIcon} /></div>, spinning: !this.state.load }}
                                    scroll={scroll} className="table-responsive " />
                            </div>
                        </div>
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
export default AddCategory;