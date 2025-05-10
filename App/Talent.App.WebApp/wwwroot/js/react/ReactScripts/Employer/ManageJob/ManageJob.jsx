import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';
import envconfig from '../../envConfig.js';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            editingJob: null,
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
            activeIndex: "",
             message: "",
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.copy = this.copy.bind(this);
        this.closeJob = this.closeJob.bind(this);
        this.editJob = this.editJob.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.updateJob = this.updateJob.bind(this); 
        this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
        this.handleSummaryInputChange = this.handleSummaryInputChange.bind(this);
       
        
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });

       
        this.loadData();
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        
        var link = `${envconfig.LISTING_API_URL}/listing/listing/getSortedEmployerJobs?showActive=true&showUnexpired=true&showExpired=true`;
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
               
                this.setState(
                    {
                        loadJobs:res.myJobs
                    }
                )
            }
           } .bind(this),
           error:function(res){
            console.error("Error on loading Jobs :", res);
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
        
    }

    handleSortChange(e, { value }) {   
        
    }

    handleTitleInputChange(event){
        
        const { value } = event.target;
       
        const updatedJob = this.state.editingJob;
        updatedJob.title = value;
        updatedJob.location = {
            city:  updatedJob.jobDetails.location.city,
            country : updatedJob.jobDetails.location.country
        }
    
        this.setState( (prevState) => ({
            editingJob: updatedJob
        }));

     
     
    }


    handleSummaryInputChange(event){
        const { value } = event.target;
        
       

        const updatedJob = this.state.editingJob;
        updatedJob.summary = value;
        updatedJob.location = {
            city:  updatedJob.jobDetails.location.city,
            country : updatedJob.jobDetails.location.country
        }
    
        this.setState( (prevState) => ({
            editingJob: updatedJob
        }));


    }

   

   
   
    copy() {
      //  Cookies.remove('talentAuthToken');
        window.location = '/Home';
    }

    editJob(jobid) {
       
        
        var link = `${envconfig.LISTING_API_URL}/listing/listing/GetJobByToEdit?id=`+jobid;
        var cookies = Cookies.get('talentAuthToken');
        
        $.ajax({
            url:link,
            headers:{
               'Authorization':'Bearer ' + cookies,
               'Content-Type': 'application/json'
            },
           // data: JSON.stringify({ id: jobid }),
            type:"GET",
            contentType:"application/json",
            dataType: "json",
            success: function(res){
             
                

             this.setState(
                { 
                    editingJob: res.jobData                    
                });
 
            
 
            } .bind(this),
            error:function(res){
             console.error("Error on Edit Job load:", res);
            
            }
 
         })




    }

    closeJob(jobid){

        if (!jobid) {
            // Validation: jobid is empty            
            console.error("Job ID is empty. Aborting closeJob.");
            return; 
        }
       
        var link = `${envconfig.LISTING_API_URL}/listing/listing/closeJob?id=`+jobid;
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
           
            message: "Successful close job" ;

            //load update job list after closing job
            this.setState((prevState) => ({
                loadJobs: prevState.loadJobs.filter(job => job.id !== jobid)
            }));

         

           } .bind(this),
           error:function(res){
            this.setState({ message: "Error occurred while closing job" });
            console.error("Error closing job:", res);
           }

        })
    }


    updateJob() {
        const updatedJob = this.state.editingJob;
         //load update job list after closing job
        
        
        var link = `${envconfig.LISTING_API_URL}/listing/listing/createUpdateJob`;
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(updatedJob),
            success: (res) => {
                this.setState({ message: "Successful edit job" });
               // message: "Successful edit job";  
                this.setState((prevState) => ({
                    loadJobs: prevState.loadJobs.map(job => 
                        job.id === updatedJob.id ? updatedJob : job
                    ),
                    editingJob: null,
                }));
            },
            error: (err) => {
                this.setState({ message: "Error occurred while updating job" });
                console.error("Error updating job:", err);
            }
        });
    }

    cancelEdit() {
        this.setState({ editingJob: null });
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

               {this.state.message && (
                        <div className={`ui message ${this.state.message.includes("Error") ? "red" : "green"}`} >
                            <p>{this.state.message}</p>
                        </div>
                    )}

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


                                {/* Edit Form */}
                    {this.state.editingJob && (
                        <div className="ui segment">
                            <h3>Edit Job</h3>
                            <Form>
                                <Form.Field>
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={this.state.editingJob.title}
                                        onChange={this.handleTitleInputChange}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Summary</label>
                                    <textarea
                                        name="summary"
                                        value={this.state.editingJob.summary}
                                        onChange={this.handleSummaryInputChange}
                                    />
                                </Form.Field>                                
                                <Form.Field>
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={this.state.editingJob.jobDetails.location.city}
                                        readOnly
                                        
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={this.state.editingJob.jobDetails.location.country}
                                        readOnly
                                        
                                    />
                                </Form.Field>
                                <button className="ui button primary" onClick={this.updateJob}>
                                    Save
                                </button>
                                <button className="ui button" onClick={this.cancelEdit}>
                                    Cancel
                                </button>
                            </Form>
                        </div>
                    )} 
                    
               
                
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
                                                this.state.loadJobs.map((job, index) => ( 
                                                    <tr key={job.id}>
                                                        <td><b>{job.title}</b></td>
                                                        <td>{job.summary}</td>
                                                        <td>{job.location.city},{job.location.country}</td>
                                                        <td> <button className="ui inverted blue button" onClick={() => this.closeJob(job.id)}>
                                                        <Icon name="ban" />  Close
                        </button> 	<button className="ui inverted blue button" onClick={() => this.editJob(job.id)}>
                        <Icon name="edit" />  Edit
                        </button> 
                        
                        <button className="ui inverted blue button" onClick={this.copy}>
                        <Icon name="copy" />  Copy
                        </button>
                        
                        </td>
                                                        <td>  {index % 2 !== 0 && (
                                                              <button className="ui  red button" >
                            Expired
                        </button>   
                                                               )}
                           </td>
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