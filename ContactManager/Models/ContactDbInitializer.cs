using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace ContactManager.Models
{
    public class ContactDbInitializer : DropCreateDatabaseAlways<ContactDbContext>
    {
        protected override void Seed(ContactDbContext db)
        {
            base.Seed(db);
        }
    }
}