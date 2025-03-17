import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';
import FormItemWrapper from '../../Form/FormItemWrapper.jsx';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData;
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: "desc",
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true,
                designation: ""
            },
            totalPages: 1,
            activeIndex: ""
        };
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
    }

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData);
        loaderData.isLoading = false;
        this.setState({ loaderData });
    }

    componentDidMount() {
        this.init();
    }

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadJobs: loader
                });
            });
        });
    }

    handleFilterChange(event, data) {
        console.log('called handleFilterChange');
    }

    handleSortChange(e, { value }) {
        this.setState({ sortBy: value }, this.loadData);
    }

    render() {
        const jobOptions = [
            { key: 'all', text: 'All', value: '' },
            { key: 'developer', text: 'Developer', value: 'Developer' },
            { key: 'manager', text: 'Manager', value: 'Manager' }
        ];
        
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h3>List of Jobs</h3>
                    
                    <Form>
                        <Form.Field>
                            <label>Filter by Designation</label>
                            <Dropdown
                                placeholder='Select Designation'
                                fluid
                                selection
                                options={jobOptions}
                                onChange={this.handleFilterChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Sort by Date</label>
                            <Dropdown
                                placeholder='Sort By'
                                fluid
                                selection
                                options={[{ key: 'desc', text: 'Newest First', value: 'desc' }, { key: 'asc', text: 'Oldest First', value: 'asc' }]}
                                onChange={this.handleSortChange}
                            />
                        </Form.Field>
                    </Form>
                    
                    <div className="profile">
                        <div className="ui grid">
                            {/* Render job listings here */}
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        );
    }
}
