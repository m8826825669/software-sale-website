from django.core.management.base import BaseCommand
from apps.products.models import Category, Product, PricingPlan, Testimonial


class Command(BaseCommand):
    help = 'Seed sample products and pricing plans'

    def handle(self, *args, **options):
        self.stdout.write('Seeding products...')

        # Categories
        edu, _ = Category.objects.get_or_create(slug='education', defaults={'name': 'Education', 'icon': '🏫', 'description': 'Software for schools and educational institutions'})
        health, _ = Category.objects.get_or_create(slug='healthcare', defaults={'name': 'Healthcare', 'icon': '🏥', 'description': 'Software for clinics and pharmacies'})
        finance, _ = Category.objects.get_or_create(slug='finance', defaults={'name': 'Finance & Accounting', 'icon': '📊', 'description': 'Accounting and billing software'})
        hr, _ = Category.objects.get_or_create(slug='hr', defaults={'name': 'HR & Payroll', 'icon': '👥', 'description': 'Human resource management'})

        PRODUCTS = [
            {
                'slug': 'school-erp', 'emoji': '🏫',
                'name': 'School Management ERP',
                'category': edu,
                'tagline': 'Complete school administration — students, attendance, fees, exams, library and more.',
                'description': 'School Management ERP is a comprehensive, offline-first desktop application built with Spring Boot 3 and JavaFX 21. Manage the complete student lifecycle, daily attendance, fee collection, examinations, library, timetables, and notices — all without an internet connection.',
                'features': [
                    {'icon': '👨‍🎓', 'title': 'Student Management', 'desc': 'Full lifecycle: admissions, profiles, transfers, pass-out.'},
                    {'icon': '✅', 'title': 'Attendance', 'desc': 'Daily class-wise attendance with 5 status types.'},
                    {'icon': '💰', 'title': 'Fee Management', 'desc': 'Collect fees, issue receipts, track pending payments.'},
                    {'icon': '📝', 'title': 'Examinations', 'desc': 'Schedule exams, enter marks, auto-calculate grades.'},
                    {'icon': '📚', 'title': 'Library', 'desc': 'Book catalog, issue/return, overdue tracking with auto-fine.'},
                    {'icon': '📢', 'title': 'Notice Board', 'desc': 'Publish announcements to targeted audiences.'},
                ],
                'tech_stack': ['Java 21', 'Spring Boot 3.2', 'JavaFX 21', 'H2 Database', 'Apache POI', 'iText PDF'],
                'requirements': {'os': 'Windows 10/11, macOS 12+, Ubuntu 20.04+', 'ram': '4 GB minimum, 8 GB recommended', 'disk': '500 MB free space', 'java': 'Java 21 or higher'},
                'platform': 'all', 'version': '1.0.0', 'file_size': '48 MB', 'is_featured': True, 'sort_order': 1,
                'plans': [
                    {'name': 'Starter', 'price': '4999', 'original_price': '6999', 'max_devices': 1, 'is_popular': False,
                     'features_included': ['1 device activation', 'All modules included', '1 year free updates', 'Email support', 'PDF reports', 'GST invoice']},
                    {'name': 'Professional', 'price': '7999', 'original_price': '11999', 'max_devices': 3, 'is_popular': True,
                     'features_included': ['3 device activations', 'All modules included', '2 years free updates', 'Priority WhatsApp support', 'Custom school branding', 'Data import/export', 'GST invoice']},
                    {'name': 'Enterprise', 'price': '14999', 'original_price': None, 'max_devices': 10, 'is_popular': False,
                     'features_included': ['10 device activations', 'All modules included', 'Lifetime updates', 'Dedicated support manager', 'On-site training (Noida/Delhi)', 'Custom feature development', 'Source code access']},
                ],
                'testimonials': [
                    {'author_name': 'Dr. Priya Sharma', 'author_role': 'Principal', 'author_company': 'DPS Noida', 'content': 'SchoolERP transformed our administration. Fee collection now takes 10 minutes instead of 3 hours.', 'rating': 5},
                    {'author_name': 'Ramesh Kumar', 'author_role': 'School Admin', 'author_company': 'St. Marys School, Lucknow', 'content': 'The library module alone saved us ₹80,000 in lost book tracking. Excellent software.', 'rating': 5},
                ],
            },
            {
                'slug': 'medical-store', 'emoji': '💊',
                'name': 'Medical Store ERP',
                'category': health,
                'tagline': 'FEFO inventory, GST billing, barcode scanning, expiry alerts, and POS interface.',
                'description': 'Complete medical store management with First-Expiry-First-Out (FEFO) inventory, GST-compliant billing, barcode scanning, and a touch-friendly POS interface. Built with FastAPI and Next.js 14.',
                'features': [
                    {'icon': '📦', 'title': 'FEFO Inventory', 'desc': 'Automatically sell oldest stock first to minimise wastage.'},
                    {'icon': '🧾', 'title': 'GST Billing', 'desc': 'GST-compliant invoices with CGST/SGST/IGST split.'},
                    {'icon': '⚠️', 'title': 'Expiry Alerts', 'desc': 'Alerts for items expiring in 30/60/90 days.'},
                    {'icon': '🖥️', 'title': 'POS Interface', 'desc': 'Touch-friendly counter interface for fast billing.'},
                    {'icon': '📊', 'title': 'Reports', 'desc': 'Sales, purchase, stock, and profit reports.'},
                    {'icon': '🔍', 'title': 'Barcode Support', 'desc': 'Scan barcodes to add items quickly at POS.'},
                ],
                'tech_stack': ['FastAPI', 'Next.js 14', 'PostgreSQL', 'SQLite', 'Python 3.11'],
                'requirements': {'os': 'Windows 10/11, macOS 12+', 'ram': '4 GB minimum', 'disk': '300 MB', 'browser': 'Chrome/Firefox (web-based interface)'},
                'platform': 'all', 'version': '1.2.0', 'file_size': '35 MB', 'is_featured': False, 'sort_order': 2,
                'plans': [
                    {'name': 'Single Store', 'price': '3499', 'original_price': '4999', 'max_devices': 1, 'is_popular': True,
                     'features_included': ['1 store location', 'All features included', '1 year updates', 'Email support', 'GST invoice']},
                    {'name': 'Multi Store', 'price': '8999', 'original_price': None, 'max_devices': 5, 'is_popular': False,
                     'features_included': ['Up to 5 store locations', 'Centralized reporting', 'Lifetime updates', 'Priority support', 'Custom branding']},
                ],
                'testimonials': [
                    {'author_name': 'Rajesh Agarwal', 'author_role': 'Pharmacist', 'author_company': 'Agarwal Medicals, Lucknow', 'content': 'The Medical Store app paid for itself in the first week. Expiry tracking alone saved us ₹40,000.', 'rating': 5},
                ],
            },
            {
                'slug': 'accounting', 'emoji': '📊',
                'name': 'BharatBooks Accounting',
                'category': finance,
                'tagline': 'GST-compliant accounting for small businesses — the affordable Tally alternative.',
                'description': 'BharatBooks is a GST-compliant accounting suite for small and medium businesses. Create invoices, track expenses, manage GST returns, view P&L and balance sheets — without the complexity of enterprise software.',
                'features': [
                    {'icon': '🧾', 'title': 'GST Invoicing', 'desc': 'Create GST invoices, credit notes, and delivery challans.'},
                    {'icon': '📊', 'title': 'Financial Reports', 'desc': 'P&L, Balance Sheet, Trial Balance, Day Book.'},
                    {'icon': '🏦', 'title': 'Bank Reconciliation', 'desc': 'Match bank statements with ledger entries.'},
                    {'icon': '📦', 'title': 'Inventory', 'desc': 'Basic stock management with reorder alerts.'},
                    {'icon': '👤', 'title': 'Multi-User', 'desc': 'Multiple staff with role-based access control.'},
                    {'icon': '📤', 'title': 'GSTR Export', 'desc': 'Export data for GSTR-1, GSTR-3B filing.'},
                ],
                'tech_stack': ['Django', 'Next.js 14', 'PostgreSQL', 'SQLite', 'Python'],
                'requirements': {'os': 'Windows 10/11, macOS 12+, Ubuntu 20.04+', 'ram': '2 GB minimum', 'disk': '200 MB'},
                'platform': 'all', 'version': '1.1.0', 'file_size': '28 MB', 'is_featured': False, 'sort_order': 3,
                'plans': [
                    {'name': 'Basic', 'price': '1999', 'original_price': '2999', 'max_devices': 1, 'is_popular': False,
                     'features_included': ['1 company', '1 device', '1 user', '1 year updates', 'Email support']},
                    {'name': 'Standard', 'price': '2999', 'original_price': '4499', 'max_devices': 2, 'is_popular': True,
                     'features_included': ['3 companies', '2 devices', '5 users', 'Bank reconciliation', '2 years updates', 'Priority support']},
                    {'name': 'Professional', 'price': '5999', 'original_price': None, 'max_devices': 5, 'is_popular': False,
                     'features_included': ['Unlimited companies', '5 devices', 'Unlimited users', 'All features', 'Lifetime updates', 'WhatsApp support']},
                ],
                'testimonials': [],
            },
        ]

        for pd in PRODUCTS:
            testimonials_data = pd.pop('testimonials', [])
            plans_data = pd.pop('plans', [])

            product, created = Product.objects.update_or_create(
                slug=pd['slug'], defaults={**pd}
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f'  {action}: {product.name}')

            # Plans
            PricingPlan.objects.filter(product=product).delete()
            for i, plan in enumerate(plans_data):
                PricingPlan.objects.create(product=product, sort_order=i, billing_cycle='one_time', max_users=plan.get('max_devices', 1), **{k: v for k, v in plan.items()})

            # Testimonials
            Testimonial.objects.filter(product=product).delete()
            for t in testimonials_data:
                Testimonial.objects.create(product=product, is_featured=True, **t)

        self.stdout.write(self.style.SUCCESS('✅ Products seeded successfully!'))
