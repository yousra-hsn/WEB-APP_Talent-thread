SIGN IN/UP - DONE
http://localhost:3000/ => index.ejs 
http://localhost:3000/login  => login.ejs 
http://localhost:3000/register  => register.ejs 
http://localhost:3000/logout (pas de vue, juste un traitement)


ADMIN -  DONE
http://localhost:3000/admin/home 

http://localhost:3000/admin/mng_users
http://localhost:3000/admin/mng_users/confirm_delete?id=[?]
http://localhost:3000/admin/mng_users/delete
http://localhost:3000/admin/mng_users/confirm_admin_access?id=[?]
http://localhost:3000/admin/mng_users/give_admin_access
http://localhost:3000/admin/mng_users/update_users
http://localhost:3000/admin/mng_users/confirm_update

http://localhost:3000/admin/mng_org
http://localhost:3000/admin/mng_org/org_processed
http://localhost:3000/admin/mng_org/org_unprocessed
http://localhost:3000/admin/mng_org/confirm_adding_org?id=[?]
http://localhost:3000/admin/mng_org/add_organization
http://localhost:3000/admin/mng_org/confirm_deleting_org?id=[?]
http://localhost:3000/admin/mng_org/delete_organization

http://localhost:3000/admin/mng_recruiters
http://localhost:3000/admin/mng_recruiters/processed
http://localhost:3000/admin/mng_users/confirm_acceptation?id=[?]
http://localhost:3000/admin/mng_users/accept_recruiter
http://localhost:3000/admin/mng_recruiters/unprocessed
http://localhost:3000/admin/mng_users/confirm_refusing?id=[?]
http://localhost:3000/admin/mng_users/refuse_recruiter

CANDIDATE - DONE
http://localhost:3000/candidate/home => candidate.ejs
http://localhost:3000/candidate/job_ads => job_ads.ejs
http://localhost:3000/candidate/job_ads/:id_offre => view.ejs
http://localhost:3000/candidate/job_ads/apply:id_offre => apply_form.ejs
http://localhost:3000/candidate/applications => applications.ejs
http://localhost:3000/candidate/applications/update/:id_offre => update_application.ejs
http://localhost:3000/candidate/applications/delete (pas de vue, juste un traitement)
http://localhost:3000/candidate/apply_for_recruiter => apply_for_recruiter.ejs
http://localhost:3000/candidate/add_organization => add_organization.ejs


RECRUITER - DONE
http://localhost:3000/recruiter/home => recruiter.ejs
http://localhost:3000/recruiter/job_ads => recruiter_job_ads.ejs 
http://localhost:3000/recruiter/job_ads/expired_job_ads => expired_job_ads.ejs 
http://localhost:3000/recruiter/job_ads/active_job_ads => active_job_ads.ejs
http://localhost:3000/recruiter/job_ads/applications/:id_offre => applications_job_ad.ejs 
http://localhost:3000/recruiter/job_ads/edit/:id_offre => edit_job_ad.ejs 
http://localhost:3000/recruiter/job_ads/new => new_job_ad.ejs 
http://localhost:3000/recruiter/job_description/new => add_job_description.ejs 
http://localhost:3000/recruiter/job_ads/delete (pas de vue, juste un traitement) 

http://localhost:3000/recruiter => do_you_have_a_recruiter_account.ejs DONE --- INUTILE : géré par la session
http://localhost:3000/recruiter/apply_for_recruiter => apply_for_recruiter.ejs --- INUTILE : c'est le candidat qui apply pour devenir recruteur
http://localhost:3000/recruiter/organizations => organizations.ejs --- INUTILE : géré côté candidat
http://localhost:3000/recruiter/organizations/add => add_an_organization.ejs --- géré côté candidat
http://localhost:3000/recruiter/organizations/join_existing => join_organization.ejs --- géré côté candidat

