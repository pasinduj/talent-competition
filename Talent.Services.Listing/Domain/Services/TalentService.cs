﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Common.Security;
using Talent.Services.Listing.Domain.Contracts;

namespace Talent.Services.Listing.Domain.Services
{
    public class TalentService : ITalentService
    {
        private readonly IRepository<Employer> _employerRepository;
        private readonly IRepository<User> _talentRepository;
        private readonly IRepository<Recruiter> _recruiterRepository;
        private readonly IUserAppContext _userAppContext;

        public TalentService(IRepository<Employer> employerRepository,
            IRepository<User> talentRepository,
            IRepository<Recruiter> recruiterRepository,
            IUserAppContext userAppContext)
        {
            _employerRepository = employerRepository;
            _recruiterRepository = recruiterRepository;
            _userAppContext = userAppContext;
            _talentRepository = talentRepository;
        }

        public async Task<IEnumerable<string>> GetTalentWatchlistIds(string employerId)
        {
            switch (_userAppContext.CurrentRole)
            {
                case "employer":
                    var emp = await _employerRepository.GetByIdAsync(employerId);
                    return emp.TalentWatchlist;
                case "recruiter":
                    var recruiter = await _recruiterRepository.GetByIdAsync(employerId);
                    return recruiter.TalentWatchlist;
                default:
                    throw new ApplicationException("Error!!");
            }
        }

        public async Task SetWatchingTalent(string employerId, string talentId, bool isWatching)
        {
            //TODO: Your code here;
            throw new NotImplementedException();
        }
    }
}
