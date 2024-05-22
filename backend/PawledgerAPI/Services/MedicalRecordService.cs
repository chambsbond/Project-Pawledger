using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Numerics;
using System.Threading;
using PawledgerAPI.Repositories;

namespace PawledgerAPI.Services
{
    public class MedicalRecordService
    {
        private PetRepository _petRepository;

        public MedicalRecordService(PetRepository petRepository)
        {
            _petRepository = petRepository;
        }

        public async Task getEventLogs()
        {
        }
    }
}
