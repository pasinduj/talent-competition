import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.signOut = this.signOut.bind(this);
        this.closeJob = this.closeJob.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)
        
        //console.log(this.state.loaderData)
        this.loadData();
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        console.log('call loadData')
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs?showActive=true&showUnexpired=true&showExpired=true';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
        $.ajax({
           url:link,
           headers:{
              'Authorization':'Bearer ' + cookies,
              'Content-Type': 'application/json'
           },
           type:"GET",
           contentType:"application/json",
           dataType: "json",
           success: function(res){

            if(res.myJobs){
                console.log(res.myJobs);
                this.setState(
                    {
                        loadJobs:res.myJobs
                    }
                )
            }
           } .bind(this),
           error:function(res){
            console.log(res.status);
           }

        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    handleFilterChange(event, data) {
        console.log('called handleFilterChange');
    }

    handleSortChange(e, { value }) {
   //     this.setState({ sortBy: value }, this.loadData);
        console.log('called handleSortChange');
    }
   
    signOut() {
        Cookies.remove('talentAuthToken');
        window.location = '/Home';
    }

    closeJob(jobid){
        console.log('call closeJob');
        console.log(jobid);
        var link = 'http://localhost:51689/listing/listing/closeJob?id='+jobid;
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
        $.ajax({
           url:link,
           headers:{
              'Authorization':'Bearer ' + cookies,
              'Content-Type': 'application/json'
           },
           data: JSON.stringify({ id: jobid }),
           type:"POST",
           contentType:"application/json",
           dataType: "json",
           success: function(res){
            console.log("Job closed successfully:", res);

            //load update job list after closing job
            this.setState((prevState) => ({
                loadJobs: prevState.loadJobs.filter(job => job.id !== jobid)
            }));

         /*   if(res.myJobs){
                console.log(res.myJobs);
                this.setState(
                    {
                        loadJobs:res.myJobs
                    }
                )
            } */

           } .bind(this),
           error:function(res){
            console.error("Error closing job:", res);
           }

        })
    }

    render() {
        const jobOptions = [
            { key: 'all', text: 'All', value: '' },
            { key: 'developer', text: 'Developer', value: 'Developer' },
            { key: 'manager', text: 'Manager', value: 'Manager' }
        ];
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
               <div className ="ui container">
			   
			   <h3>List of Jobs</h3>
                <Form>
                    <Form.Group widths="equal">
                        <Form.Field>
                            <label>Filter <Icon name="filter" /></label>
                            <Dropdown
                                placeholder="Choose Filter"
                                fluid
                                selection
                                options={jobOptions}
                                onChange={this.handleFilterChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Sort by Date <Icon name="calendar alternate outline" /></label>
                            <Dropdown
                                placeholder="Sort By"
                                fluid
                                selection
                                options={[
                                    { key: 'desc', text: 'Newest First', value: 'desc' },
                                    { key: 'asc', text: 'Oldest First', value: 'asc' }
                                ]}
                                onChange={this.handleSortChange}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form>
			   
			   
			   <div className="profile">
                    <div className="ui grid">

                    
               
                
                        <div className="ui segment">
               
                                       
                                        <table  className="ui celled table">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Summary</th>
                                                    <th>Location</th>
                                                    <th></th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.loadJobs.length > 0 ? (
                                                this.state.loadJobs.map((job) => (
                                                    <tr key={job.id}>
                                                        <td><b>{job.title}</b></td>
                                                        <td>{job.summary}</td>
                                                        <td>{job.location.city},{job.location.country}</td>
                                                        <td> <button className="ui inverted blue button" onClick={() => this.closeJob(job.id)}>
                                                        <Icon name="ban" />  Close
                        </button> 	<button className="ui inverted blue button" onClick={this.signOut}>
                        <Icon name="edit" />  Edit
                        </button> 
                        
                        <button className="ui inverted blue button" onClick={this.signOut}>
                        <Icon name="copy" />  Copy
                        </button>
                        
                        </td>
                                                        <td>  <button className="ui  red button" >
                            Expired
                        </button>      </td>
                                                    </tr>
                                                    ))
                                                ):(
                                                    <tr>
                            <td colSpan="5" className="center aligned">
                                <b>No job found</b>
                            </td>
                        </tr>
                                                )
                                                }
                                            </tbody>
                                        </table>
                        </div>
                   
                                                       
                    </div>          
                       
                </div>
			   
			   		   
			   </div>
            </BodyWrapper>
        )
    }
}