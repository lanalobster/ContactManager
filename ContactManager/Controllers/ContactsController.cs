using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ContactManager.Models;

namespace ContactManager.Controllers
{
    public class ContactsController : Controller
    {
        private ContactDbContext db = new ContactDbContext();

        [HttpGet]
        public ActionResult Index()
        {
            return View("Upload");
        }

        [HttpPost]
        public ActionResult Index(HttpPostedFileBase postedFile)
        {
            if (postedFile == null)
            {
                ViewBag.Message = "Please choose a file to upload.";
                return View("Upload");
            }
            if (Path.GetExtension(postedFile.FileName) != ".csv")
            {
                ViewBag.Message = "Please select a file with a .csv extension.";
                return View("Upload");
            }
            try
            {
                using (var reader = new StreamReader(postedFile.InputStream))
                {
                    reader.ReadLine();
                    while (!reader.EndOfStream)
                    {
                        string[] rows = reader.ReadLine().Split(';');
                        if(rows.Length <= 1)
                            rows = reader.ReadLine().Split(',');
                        db.Contacts.Add(new Contact()
                        {
                            Name = rows[0],
                            DateOfBirth = rows[1],
                            Married = Convert.ToBoolean(rows[2]),
                            Phone = rows[3],
                            Salary = Convert.ToSingle(rows[4])
                        });
                    }
                }
                db.SaveChanges();
            }
            catch (FormatException e)
            {
                ViewBag.Message = e.Message + "\nPlease check tha data formats in the file";
                return View("Upload");
            }
            catch (Exception e)
            {
                ViewBag.Message = e.Message;
                return View("Upload");
            }
            return View(db.Contacts.ToList());
        }

        [HttpPost]
        public ActionResult Edit([Bind(Include = "Id, Name, DateOfBirth, Married, Phone, Salary")] Contact contact)
        {
            if (ModelState.IsValid)
            {
                db.Entry(contact).State = EntityState.Modified;
                db.SaveChanges();
            }
            return View("Index", db.Contacts.ToList());
        }
        
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Contact contact = db.Contacts.Find(id);
            if (contact == null)
            {
                return HttpNotFound();
            }
            db.Contacts.Remove(contact);
            db.SaveChanges();
            return View("Index", db.Contacts.ToList());
        }
        
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
