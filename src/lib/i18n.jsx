import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'etlamo-lang'

export const translations = {
  en: {
    // Brand
    brand_name: 'Etlamo',
    brand_tagline: 'Verified luxury wedding & celebration planners',
    brand_desc: 'The verified portfolio and celebration discovery marketplace for discerning clients and luxury event planners.',

    // Nav
    nav_explore: 'Explore',
    nav_planners: 'Planners',
    nav_requests: 'Requests',
    nav_messages: 'Messages',
    nav_dashboard: 'Dashboard',
    nav_review_queue: 'Review queue',
    nav_signin: 'Sign in',
    nav_join: 'Join Etlamo',
    nav_post_request: 'Post request',
    nav_add_project: 'Add project',
    nav_my_profile: 'My public profile',
    nav_verification: 'Verification',
    nav_signout: 'Sign out',

    // Hero
    hero_kicker: 'For weddings, galas and milestone celebrations',
    hero_title_1: 'Celebrations,',
    hero_title_2: 'beautifully planned.',
    hero_subtitle: 'Discover the curated portfolios of verified luxury planners. Post what you’re dreaming of. Let the right talent reach out.',
    hero_cta_post: 'Post your event',
    hero_cta_requests: 'Browse open requests',
    hero_cta_explore: 'Explore portfolio work',
    hero_rooftop_label: 'Rooftop Vows at Golden Hour',
    by_planner: 'by',

    // Stats
    stat_planners_num: '180+',
    stat_planners_label: 'Verified luxury planners',
    stat_events_num: '14,200+',
    stat_events_label: 'Celebrations showcased',
    stat_reply_num: '< 4 hours',
    stat_reply_label: 'Median initial reply',
    stat_verified_num: '100%',
    stat_verified_label: 'Vetted & insured profiles',

    // How it works
    how_title_main: 'Two sides.',
    how_title_sub: 'One beautifully fluid flow.',
    how_client_kicker: 'For clients & couples',
    how_client_title: 'Tell us the dream. Vetted planners come to you.',
    how_client_step1_title: 'Post your vision',
    how_client_step1_desc: 'Date, guest count, estimated budget and preferred aesthetic in two minutes.',
    how_client_step2_title: 'Hear from verified talent',
    how_client_step2_desc: 'Only identity-confirmed and insured professionals can reply.',
    how_client_step3_title: 'Review & collaborate',
    how_client_step3_desc: 'Compare portfolios, review moodboards and chat in one unified inbox.',
    how_client_cta: 'Post an event request',

    how_planner_kicker: 'For event producers',
    how_planner_title: 'Your best work, directly in front of ideal clients.',
    how_planner_step1_title: 'Build your showcase',
    how_planner_step1_desc: 'Display high-resolution galleries and full vendor team credits.',
    how_planner_step2_title: 'Earn the verified badge',
    how_planner_step2_desc: 'Verify credentials and insurance to build immediate client trust.',
    how_planner_step3_title: 'Reply to qualified leads',
    how_planner_step3_desc: 'Browse fresh client requests and send customized introductions.',
    how_planner_cta: 'Apply as a planner',

    // Curated & Trust
    curated_kicker: 'Curated Collections',
    curated_title: 'Standout celebrations',
    curated_subtitle: 'Real events produced by verified studios across the continent.',
    explore_all: 'Explore all work',

    trust_badge: 'Etlamo Verification Standard',
    trust_title_1: 'Every planner.',
    trust_title_2: 'Verified.',
    trust_subtitle: 'Before any planner can message you or appear in public search, our dedicated trust team inspects four tiers of professional credentials.',
    trust_item1_t: 'Identity Authenticated',
    trust_item1_d: 'Government photo ID biometric verification matched to the account holder.',
    trust_item2_t: 'Commercial Liability Insurance',
    trust_item2_d: 'Active policy with at least $1,000,000 to $2,000,000 general aggregate coverage.',
    trust_item3_t: 'Registered Business Entity',
    trust_item3_d: 'Official state or municipal business registration verified in good standing.',
    trust_item4_t: 'Client Reference Checked',
    trust_item4_d: 'Our team directly contacts recent clients to confirm delivery and professionalism.',

    // Happening Soon
    active_board_kicker: 'Active Board',
    active_board_title: 'Happening soon',
    active_board_subtitle: 'Fresh event briefs posted by clients seeking experienced planners.',
    all_requests: 'All requests',

    // Testimonials
    find_planner_title: 'Find the planner who understands your aesthetic.',
    find_planner_subtitle: 'Browse by city and specialty, view authenticated event galleries, and connect with professionals holding the verified badge.',
    find_planner_cta: 'Browse verified planners',
    find_planner_account: 'Create a client account',

    // Categories
    cat_all: 'All',
    cat_wedding: 'Wedding',
    cat_corporate: 'Corporate',
    cat_birthday: 'Birthday',
    cat_dinner: 'Dinner',
    cat_destination: 'Destination',
    cat_cultural: 'Cultural',

    // Explore page
    explore_eyebrow: 'Editorial Portfolio Gallery',
    explore_title: 'Explore',
    explore_sub: 'Celebrations produced by verified planners. Discover aesthetics, venues and floristry you love, then meet the person behind them.',
    search_placeholder: 'Search aesthetics, cities, venues…',
    sort_curated: 'Curated',
    sort_recent: 'Recent',
    showing_celebrations: 'Showing',
    celebrations_count: 'celebrations',
    filtered_by: 'Filtered by:',
    no_celebrations_title: 'No celebrations found',
    no_celebrations_desc: 'Try clearing your search term or selecting a different category.',
    reset_filters: 'Reset filters',

    // Project Detail
    back_to_explore: 'Back to explore',
    showcase: 'Showcase',
    delete_project: 'Delete project',
    appreciate: 'Appreciate',
    appreciated: 'Appreciated',
    share: 'Share',
    link_copied: 'Project link copied to clipboard',
    click_to_expand: 'Click to expand full gallery',
    photos_count: 'photos',
    vision_experience: 'The Vision & Experience',
    creative_team_title: 'Creative Team & Vendor Credits',
    creative_team_subtitle: 'Every extraordinary celebration is crafted by a dedicated collective of artists and artisans.',
    event_highlights: 'Event Highlights',
    location: 'Location',
    date: 'Date',
    guest_count: 'Guest Count',
    community_appreciations: 'Community Appreciations',
    portfolio_impressions: 'Portfolio Impressions',
    interested_aesthetic: 'Interested in an event with this aesthetic or scale? Direct inquiry messages go straight to the planner.',
    inquire_style: 'Inquire about this style',
    more_by_planner: 'More by',
    view_full_profile: 'View full profile →',

    // Planners page
    planners_eyebrow: 'Verified Directory',
    planners_title: 'Planners',
    planners_sub: 'Every planner here has passed identity verification, commercial liability insurance checks, and past-client reference screening.',
    search_planners_placeholder: 'Search by name, business or city…',
    price_guide: 'Price guide:',
    price_all: 'All budgets',
    price_under10: '< $10k',
    price_10to25: '$10k–$25k',
    price_25plus: '$25k+',
    showing_planners: 'Showing',
    verified_pros: 'verified professionals',
    no_planners_title: 'No planners match your criteria',
    no_planners_desc: 'Try resetting the specialty or budget filter to discover more verified planners.',
    reset_all_filters: 'Reset all filters',

    // Planner Profile
    profile_unavailable: 'Planner profile unavailable',
    profile_private_desc: 'This portfolio is private or still completing trust verification.',
    return_to_directory: 'Return to Directory',
    add_new_project: 'Add new project',
    years_experience: 'years curating luxury celebrations',
    full_services_from: 'Full services from',
    specialties_aesthetic: 'Specialties & Aesthetic',
    tab_portfolio: 'Portfolio',
    tab_services_pricing: 'Services & Pricing',
    tab_reviews: 'Reviews',
    fete_verified_credentials: 'Etlamo Verified Credentials',
    verified_id: 'Government ID & Identity Verified',
    verified_insurance: '$2,000,000 Commercial Liability Coverage',
    verified_business: 'Registered Business Entity in Good Standing',
    verified_references: 'Past-Client References Verified by Trust Team',
    based_on_reviews: 'Based on 24 verified past-client evaluations',
    verified_reviews_badge: '100% Verified Reviews',

    // Requests page
    requests_title: 'Requests',
    requests_sub_planner: 'People planning something right now. Reach out to the ones that fit your work.',
    requests_sub_client: 'Tell planners what you need and let them come to you.',
    post_a_request: 'Post a request',
    request_board_mine: 'My requests',
    request_board_open: 'All open',
    req_what_looking_for: 'What they’re looking for',
    req_help_needed: 'Help needed with',
    req_planner_responses: 'Planner responses',
    req_interested: 'Interested?',
    req_introduce_yourself: 'Introduce yourself and share relevant work.',
    req_verify_to_reply: 'Verify to reply',
    req_verify_to_reply_sub: 'Only verified planners can message clients.',
    req_get_verified: 'Get verified',
    req_are_you_planner: 'Are you a planner?',
    req_join_planner_sub: 'Join and get verified to reply to requests like this one.',
    req_join_as_planner: 'Join as a planner',
    req_planning_own: 'Planning your own event?',
    req_disclaimer: 'Client contact details are never shared publicly. All conversations happen in Etlamo Messages.',
    req_close: 'Close request',
    req_reopen: 'Reopen request',
    req_closed_badge: 'Closed',
    req_open_badge: 'Open',
    req_not_found_title: 'Request not found',
    req_not_found_sub: 'It may have been removed or fulfilled.',
    req_new_eyebrow: 'New request',
    req_new_title: 'What are you planning?',
    req_new_sub: 'The more detail you share, the better planners can tailor their first message.',
    req_event_type: 'Event type',
    req_headline_label: 'Give it a headline',
    req_headline_placeholder: 'e.g. Autumn vineyard wedding for 120 guests',
    req_date_label: 'Date',
    req_location_label: 'Location',
    req_guests_label: 'Guests',
    req_budget_label: 'Budget',
    req_help_label: 'What do you need help with?',
    req_desc_label: 'Describe your event',
    req_desc_placeholder: 'The mood, must-haves, venue ideas, anything planners should know…',
    req_safe_guarantee: 'Only verified planners can contact you.',
    req_submit_btn: 'Post request',

    // Dashboard
    dash_edit_profile: 'Edit profile',
    dash_open_requests: 'Open requests',
    dash_conversations: 'Planner conversations',
    dash_unread: 'Unread',
    dash_post_request_cta: 'Post a request',
    dash_post_request_sub: 'Get replies from verified planners',
    dash_your_requests: 'Your requests',
    dash_no_requests_title: 'Tell planners what you need',
    dash_no_requests_sub: 'Post your first request. Most clients hear from a planner within hours.',
    dash_planners_love: 'Planners you might love',
    dash_browse_all: 'Browse all',
    dash_recent_messages: 'Recent messages',
    dash_see_all: 'See all',
    dash_your_portfolio: 'Your portfolio',
    dash_view_profile: 'View public profile',
    dash_add_project: 'Add a project',
    dash_add_project_sub: 'Show off an event you planned',
    dash_new_requests_for_you: 'New requests for you',
    dash_verification: 'Verification',
    dash_appreciations: 'Appreciations',
    dash_project_views: 'Project views',
    dash_client_conversations: 'Client conversations',
    dash_in_review: 'In review',
    dash_verified: 'Verified',
    dash_start_verification: 'Start verification',
    dash_view_status: 'View status',
    dash_finish_verification: 'Finish verification to go live',
    dash_keep_adding_projects: 'Keep adding projects. They’ll appear in Explore the moment you’re approved.',

    // Messages page
    messages_title: 'Messages',
    select_conversation: 'Select a conversation',
    no_conversations_yet: 'No conversations yet.',
    type_message_placeholder: 'Message…',
    delivered: 'Delivered',
    typing: 'Typing…',
    search_messages: 'Search conversations…',
    about_request: 'About request',
    about_project: 'About project',
    portfolio_btn: 'Portfolio',

    // Verify page
    verify_badge_title: 'Get your verified badge.',
    verify_badge_sub: 'Verified planners can message clients, appear in search and show the badge on every project.',
    verify_step_business: 'Business',
    verify_step_credentials: 'Credentials',
    verify_step_review: 'Review',
    verify_submit: 'Submit for review',
    verify_continue: 'Continue',
    verify_back: 'Back',
    verify_finish_later: 'Finish later',
    verify_status_verified: 'You’re verified.',
    verify_status_pending: 'Application in review.',
    verify_status_rejected: 'Not approved yet.',
    verify_sub_verified: 'Your profile and projects are public, and you can now message clients directly.',
    verify_sub_pending: 'Our trust team is checking your details. Meanwhile you can keep building your portfolio.',
    verify_sub_rejected: 'Update your application with the requested changes and resubmit.',

    // Contact
    contact_disclaimer: 'Messages stay on Etlamo until you choose to share contact details.',
    contact_your_message: 'Your message',
    contact_send: 'Send',
    contact_cancel: 'Cancel',
    contact_verification_required: 'Verification required',
    contact_open_conv: 'Open conversation',

    // Persona & Footer
    quick_persona: 'Quick Demo Persona',
    persona_switch_note: 'Switch accounts instantly to explore both sides of the marketplace.',
    visitor_mode: 'Visitor',
    reset_demo: 'Reset interactive demo state',
    replay_preloader: 'Preview preloader',
    copyright: `© ${new Date().getFullYear()} Etlamo Inc. All portfolios, requests and reviews verified.`,
  },
  ar: {
    // Brand
    brand_name: 'إتلامو',
    brand_tagline: 'منصة نخبة مخططي الحفلات والأعراس المعتمدين',
    brand_desc: 'الوجهة الموثوقة لاكتشاف أرقى معارض أعمال مخططي الأعراس والمناسبات الفاخرة وربطهم بنخبة العملاء.',

    // Nav
    nav_explore: 'استكشف',
    nav_planners: 'المخططون',
    nav_requests: 'الطلبات',
    nav_messages: 'الرسائل',
    nav_dashboard: 'لوحة التحكم',
    nav_review_queue: 'قائمة المراجعة',
    nav_signin: 'تسجيل الدخول',
    nav_join: 'انضم إلى إتلامو',
    nav_post_request: 'طلب تنظيم حفل',
    nav_add_project: 'إضافة عمل',
    nav_my_profile: 'ملفي العام',
    nav_verification: 'التوثيق والاعتماد',
    nav_signout: 'تسجيل الخروج',

    // Hero
    hero_kicker: 'للأعراس والمناسبات والاحتفالات الاستثنائية',
    hero_title_1: 'احتفالات استثنائية،',
    hero_title_2: 'بتنظيم لا يُنسى.',
    hero_subtitle: 'اكتشف أعمال نخبة مخططي الحفلات والأعراس المعتمدين. شاركنا رؤيتك، ودع أصحاب الخبرة والتألق يتواصلون معك.',
    hero_cta_post: 'أعلن عن مناسبتك',
    hero_cta_requests: 'استعرض الطلبات الحالية',
    hero_cta_explore: 'استكشف معرض الأعمال',
    hero_rooftop_label: 'عقد قران على سطح بانورامي عند الغروب',
    by_planner: 'بتنظيم',

    // Stats
    stat_planners_num: '+١٨٠',
    stat_planners_label: 'مخطط حفلات معتمد وموثق',
    stat_events_num: '+١٤,٢٠٠',
    stat_events_label: 'مناسبة فاخرة موثقة',
    stat_reply_num: 'أقل من ٤ ساعات',
    stat_reply_label: 'متوسط الرد الأولي',
    stat_verified_num: '١٠٠٪',
    stat_verified_label: 'ملفات مفحوصة ومؤمنة مهنياً',

    // How it works
    how_title_main: 'طرفان متميزان.',
    how_title_sub: 'وتجربة انسيابية متكاملة.',
    how_client_kicker: 'للعملاء وأصحاب المناسبات',
    how_client_title: 'شاركنا حلمك، ونخبة المخططين المعتمدين يتواصلون معك.',
    how_client_step1_title: 'صف تفاصيل مناسبتك',
    how_client_step1_desc: 'الموعد، عدد الضيوف، الميزانية التقريبية، والطابع الذي تطمح إليه خلال دقيقتين.',
    how_client_step2_title: 'استقبل عروض المعتمدين',
    how_client_step2_desc: 'يتواصل معك فقط من اجتازوا فحص الهوية والترخيص والتأمين المهني.',
    how_client_step3_title: 'قارن وتواصل بسلاسة',
    how_client_step3_desc: 'تصفح سوابق الأعمال ولوحات الإلهام وتواصل عبر محادثات فورية ومباشرة.',
    how_client_cta: 'انشر طلب مناسبة الآن',

    how_planner_kicker: 'لمنتجي ومنظمي الحفلات الفاخرة',
    how_planner_title: 'أعظم إبداعاتك، أمام نخبة العملاء الباحثين عن التميز.',
    how_planner_step1_title: 'ابنِ معرض أعمالك الفاخر',
    how_planner_step1_desc: 'اعرض فعالياتك بجودة فائقة مع ذكر كافة أعضاء الفريق والموردين المبدعين.',
    how_planner_step2_title: 'احصل على وسام الاعتماد',
    how_planner_step2_desc: 'وثّق هويتك وتأمينك التجاري لتكسب ثقة مطلقة من أول نظرة.',
    how_planner_step3_title: 'تواصل مع عملاء جادين',
    how_planner_step3_desc: 'تصفح طلبات الحفلات المنشورة حديثاً وقدّم رؤيتك المبتكرة للعميل مباشرة.',
    how_planner_cta: 'قدّم كمنظم معتمد',

    // Curated & Trust
    curated_kicker: 'مجموعات مختارة',
    curated_title: 'احتفالات ملهمة',
    curated_subtitle: 'فعاليات حقيقية من إبداع استوديوهات معتمدة ومحترفة.',
    explore_all: 'استكشف المعرض بالكامل',

    trust_badge: 'معيار الاعتماد والتوثيق في إتلامو',
    trust_title_1: 'كل منظم هنا.',
    trust_title_2: 'معتمد وموثوق.',
    trust_subtitle: 'قبل أن يتمكن أي مخطط من مراسلتك أو الظهور في دليل البحث، يراجع فريق النزاهة لدينا ٤ معايير مهنية صارمة.',
    trust_item1_t: 'إثبات الهوية الرسمية',
    trust_item1_d: 'فحص الهوية الحكومية ومطابقتها تقنياً مع صاحب الحساب.',
    trust_item2_t: 'التأمين التجاري ضد المسؤولية',
    trust_item2_d: 'وثيقة تأمين مهني نشطة بقيمة تغطية شاملة تبدأ من مليون دولار.',
    trust_item3_t: 'سجل تجاري نظامي وسارٍ',
    trust_item3_d: 'التأكد من التراخيص الرسمية والكيان التجاري لدى الجهات المعتمدة.',
    trust_item4_t: 'التحقق من عملاء سابقين',
    trust_item4_d: 'يتواصل فريقنا هاتفياً مع عملاء حديثين للتأكد من جودة الإنجاز وحسن التعامل.',

    // Happening Soon
    active_board_kicker: 'لوحة الطلبات الحالية',
    active_board_title: 'مناسبات قريبة تبحث عن مخطط',
    active_board_subtitle: 'موجز طلبات طازجة نشرها عملاء يبحثون عن خبرات استثنائية.',
    all_requests: 'كافة الطلبات',

    // Testimonials
    find_planner_title: 'ابحث عن المخطط الذي يتقن تجسيد ذوقك.',
    find_planner_subtitle: 'تصفح حسب المدينة والتخصص، شاهد معارض صور حقيقية، وتواصل مع الحاصلين على شارة التوثيق.',
    find_planner_cta: 'تصفح المخططين المعتمدين',
    find_planner_account: 'أنشئ حساب عميل مجاناً',

    // Categories
    cat_all: 'الكل',
    cat_wedding: 'أعراس',
    cat_corporate: 'فعاليات شركات',
    cat_birthday: 'أعياد ميلاد',
    cat_dinner: 'عشاء فاخر',
    cat_destination: 'وجهات عالمية',
    cat_cultural: 'احتفالات تراثية',

    // Explore page
    explore_eyebrow: 'معرض الإلهام والأعمال الفاخرة',
    explore_title: 'استكشف',
    explore_sub: 'أعراس وفعاليات موثقة من إبداع مخططين معتمدين. اكتشف الطابع والزهور والقاعات الملهمة ثم تعرّف على صانعيها.',
    search_placeholder: 'ابحث بالأسلوب، المدينة، القاعة…',
    sort_curated: 'المميزة',
    sort_recent: 'الأحدث',
    showing_celebrations: 'عرض',
    celebrations_count: 'مناسبة ملهمة',
    filtered_by: 'التصنيف:',
    no_celebrations_title: 'لم يتم العثور على مناسبات مطابقة',
    no_celebrations_desc: 'جرّب تعديل كلمات البحث أو اختيار تصنيف مختلف.',
    reset_filters: 'إعادة ضبط التصفية',

    // Project Detail
    back_to_explore: 'العودة إلى المعرض',
    showcase: 'عرض توثيقي',
    delete_project: 'حذف العمل',
    appreciate: 'إعجاب',
    appreciated: 'معجب به',
    share: 'مشاركة',
    link_copied: 'تم نسخ رابط الحفل إلى الحافظة',
    click_to_expand: 'انقر لتكبير المعرض بدقة عالية',
    photos_count: 'صور',
    vision_experience: 'الرؤية والتجربة الإبداعية',
    creative_team_title: 'فريق العمل والموردون المساهمون',
    creative_team_subtitle: 'كل حفل مبهر يولد من تعاون نخبة من الفنانين والموردين المحترفين.',
    event_highlights: 'أبرز ملامح الحفل',
    location: 'الموقع',
    date: 'الموعد',
    guest_count: 'عدد الضيوف',
    community_appreciations: 'إعجابات المجتمع',
    portfolio_impressions: 'المشاهدات',
    interested_aesthetic: 'هل ترغب في حفل يجسد هذا الطابع أو المقياس؟ تصل رسالتك مباشرة إلى المخطط المسئول.',
    inquire_style: 'تواصل بشأن هذا الأسلوب',
    more_by_planner: 'المزيد من أعمال',
    view_full_profile: 'عرض الملف الكامل ←',

    // Planners page
    planners_eyebrow: 'دليل النخبة المعتمد',
    planners_title: 'المخططون',
    planners_sub: 'اجتاز كل مخطط في هذا الدليل فحوصات الهوية الرسمية، التأمين المهني، ومراجعة تقييمات العملاء السابقين.',
    search_planners_placeholder: 'ابحث بالاسم، اسم الاستوديو أو المدينة…',
    price_guide: 'دليل الميزانيات:',
    price_all: 'جميع الميزانيات',
    price_under10: 'أقل من ١٠ آلاف $',
    price_10to25: '١٠ – ٢٥ ألف $',
    price_25plus: 'أكثر من ٢٥ ألف $',
    showing_planners: 'عرض',
    verified_pros: 'منظمين معتمدين',
    no_planners_title: 'لا يوجد مخططون مطابقون للبحث',
    no_planners_desc: 'جرّب تغيير التخصص أو نطاق الميزانية لاكتشاف المزيد من المنظمين المعتمدين.',
    reset_all_filters: 'إعادة ضبط كافة الفلاتر',

    // Planner Profile
    profile_unavailable: 'ملف المنظم غير متاح',
    profile_private_desc: 'هذا الملف ما زال خاصاً أو قيد استكمال مراجعة معايير الثقة والاعتماد.',
    return_to_directory: 'العودة لدليل المخططين',
    add_new_project: 'إضافة عمل جديد',
    years_experience: 'سنوات من الإبداع في تنظيم الفعاليات',
    full_services_from: 'الباقات الكاملة تبدأ من',
    specialties_aesthetic: 'التخصصات والأسلوب الفني',
    tab_portfolio: 'معرض الأعمال',
    tab_services_pricing: 'الباقات والأسعار',
    tab_reviews: 'آراء وتقييمات العملاء',
    fete_verified_credentials: 'بيانات الاعتماد والتوثيق الرسمية',
    verified_id: 'هوية رسمية وبيانات شخصية موثقة',
    verified_insurance: 'تغطية تأمينية تجارية بقيمة ٢,٠٠٠,٠٠٠ $',
    verified_business: 'كيان تجاري مرخص ومسجل ساري المفعول',
    verified_references: 'تأكيد مباشر من عملاء موثقين لدى فريق الثقة',
    based_on_reviews: 'بناءً على ٢٤ تقييماً حقيقياً من عملاء سابقين',
    verified_reviews_badge: '١٠٠٪ تقييمات موثقة',

    // Requests page
    requests_title: 'طلبات الحفلات',
    requests_sub_planner: 'عملاء يستعدون لمناسباتهم حالياً. اختر المناسبة التي تتوافق مع خبرتك وأسلوبك.',
    requests_sub_client: 'شارك تفاصيل مناسبتك ودع الخبراء يتقدمون بعروضهم المناسبة.',
    post_a_request: 'نشر طلب مناسبة',
    request_board_mine: 'طلباتي الخاصة',
    request_board_open: 'كافة الطلبات المتاحة',
    req_what_looking_for: 'ما يبحث عنه العميل',
    req_help_needed: 'المساعدة المطلوبة في',
    req_planner_responses: 'عروض المخططين',
    req_interested: 'مهتم بتنظيم هذا الحفل؟',
    req_introduce_yourself: 'عرّف بنفسك واعرض رؤيتك وأعمالك الملائمة.',
    req_verify_to_reply: 'التوثيق مطلوب للرد',
    req_verify_to_reply_sub: 'يحق للمخططين المعتمدين والموثقين فقط مراسلة العملاء.',
    req_get_verified: 'توثيق الحساب',
    req_are_you_planner: 'هل أنت مخطط حفلات محترف؟',
    req_join_planner_sub: 'انضم إلى إتلامو واجتز التوثيق للرد على طلبات العملاء.',
    req_join_as_planner: 'انضم كمخطط حفلات',
    req_planning_own: 'تخطط لمناسبتك الخاصة؟',
    req_disclaimer: 'بيانات التواصل الشخصية للعميل لا تُنشر أبداً. كافة المحادثات تتم بأمان عبر رسائل إتلامو.',
    req_close: 'إغلاق الطلب',
    req_reopen: 'إعادة فتح الطلب',
    req_closed_badge: 'مغلق',
    req_open_badge: 'متاح للتقديم',
    req_not_found_title: 'لم يتم العثور على الطلب',
    req_not_found_sub: 'ربما تم حذفه أو اكتمال الاتفاق عليه.',
    req_new_eyebrow: 'طلب جديد',
    req_new_title: 'ما هي المناسبة التي تخطط لها؟',
    req_new_sub: 'كلما زادت التفاصيل، استطاع المخططون تقديم عروض وتصورات أدق منذ البداية.',
    req_event_type: 'نوع المناسبة',
    req_headline_label: 'عنوان رئيسي للمناسبة',
    req_headline_placeholder: 'مثال: حفل زفاف خريفي في فيلا لـ ١٢٠ ضيفاً',
    req_date_label: 'الموعد',
    req_location_label: 'المدينة / الموقع',
    req_guests_label: 'عدد الضيوف',
    req_budget_label: 'الميزانية المتوقعة',
    req_help_label: 'ما هي المجالات التي تحتاج دعماً بها؟',
    req_desc_label: 'صف مناسبتك وتطلعاتك',
    req_desc_placeholder: 'الأجواء، الضروريات، أفكار المكان، أو أي تفاصيل ترغب بمشاركتها…',
    req_safe_guarantee: 'يتواصل معك حصرياً المخططون المعتمدون والمفحوصون.',
    req_submit_btn: 'نشر الطلب الآن',

    // Dashboard
    dash_edit_profile: 'تعديل الملف الشخصي',
    dash_open_requests: 'طلبات متاحة',
    dash_conversations: 'محادثات المخططين',
    dash_unread: 'غير مقروءة',
    dash_post_request_cta: 'انشر طلب مناسبة',
    dash_post_request_sub: 'استقبل عروض نخبة المخططين المعتمدين',
    dash_your_requests: 'طلباتك الحالية',
    dash_no_requests_title: 'أخبر المخططين بما تبحث عنه',
    dash_no_requests_sub: 'انشر طلبك الأول. معظم العملاء يتلقون ردوداً خلال ساعات قليلة.',
    dash_planners_love: 'مخططون قد ينالون إعجابك',
    dash_browse_all: 'استعراض الكل',
    dash_recent_messages: 'أحدث الرسائل',
    dash_see_all: 'عرض الكل',
    dash_your_portfolio: 'معرض أعمالك',
    dash_view_profile: 'عرض الملف العام',
    dash_add_project: 'إضافة عمل جديد',
    dash_add_project_sub: 'استعرض مناسبة قمت بتنظيمها وإخراجها',
    dash_new_requests_for_you: 'طلبات جديدة تناسب خبرتك',
    dash_verification: 'حالة الاعتماد والتوثيق',
    dash_appreciations: 'الإعجابات المستلمة',
    dash_project_views: 'مشاهدات الأعمال',
    dash_client_conversations: 'محادثات العملاء',
    dash_in_review: 'قيد المراجعة',
    dash_verified: 'معتمد وموثق',
    dash_start_verification: 'بدء التوثيق',
    dash_view_status: 'متابعة الحالة',
    dash_finish_verification: 'أكمل التوثيق لتفعيل الحساب للجمهور',
    dash_keep_adding_projects: 'واصل إضافة أعمالك. ستظهر في المعرض العام فور اكتمال الاعتماد.',

    // Messages page
    messages_title: 'الرسائل والمحادثات',
    select_conversation: 'اختر محادثة للمتابعة',
    no_conversations_yet: 'لا توجد محادثات حتى الآن.',
    type_message_placeholder: 'اكتب رسالتك هنا…',
    delivered: 'تم التسليم',
    typing: 'يكتب الآن…',
    search_messages: 'ابحث في المحادثات…',
    about_request: 'بخصوص الطلب',
    about_project: 'بخصوص العمل المعروض',
    portfolio_btn: 'معرض الأعمال',

    // Verify page
    verify_badge_title: 'احصل على وسام التوثيق المعتمد.',
    verify_badge_sub: 'المخطط المعتمد يحصل على شارة الثقة الرسمية، ويظهر في البحث، وتتاح له مراسلة العملاء بحرية.',
    verify_step_business: 'بيانات العمل',
    verify_step_credentials: 'الوثائق والشهادات',
    verify_step_review: 'المراجعة النهائية',
    verify_submit: 'إرسال للمراجعة والاعتماد',
    verify_continue: 'متابعة',
    verify_back: 'السابق',
    verify_finish_later: 'إكمال لاحقاً',
    verify_status_verified: 'أنت موثق ومعتمد رسمياً.',
    verify_status_pending: 'طلب التوثيق قيد المراجعة.',
    verify_status_rejected: 'الطلب بحاجة لتعديلات.',
    verify_sub_verified: 'ملفك وأعمالك متاحة للجمهور، ويمكنك الآن مراسلة العملاء والرد على كافة الطلبات.',
    verify_sub_pending: 'يقوم فريق الثقة بمراجعة وثائقك حالياً. يمكنك أثناء ذلك مواصلة بناء معرض أعمالك.',
    verify_sub_rejected: 'يُرجى تحديث الطلب وتصحيح الملاحظات المذكورة أدناه ثم إعادة الإرسال.',

    // Contact
    contact_disclaimer: 'تتم الرسائل بأمان داخل إتلامو حتى تقرر أنت مشاركة بيانات التواصل المباشرة.',
    contact_your_message: 'رسالتك',
    contact_send: 'إرسال',
    contact_cancel: 'إلغاء',
    contact_verification_required: 'التوثيق مطلوب للمراسلة',
    contact_open_conv: 'فتح المحادثة',

    // Persona & Footer
    quick_persona: 'التبديل السريع للحسابات التجريبية',
    persona_switch_note: 'تنقل بين الحسابات لاختبار تجربة كل من العميل والمخطط وفريق المراجعة.',
    visitor_mode: 'وضع الزائر (غير مسجل)',
    reset_demo: 'إعادة ضبط البيانات التجريبية',
    replay_preloader: 'استعراض شاشة التحميل',
    copyright: `© ${new Date().getFullYear()} إتلامو (Etlamo Inc). كافة الحقوق محفوظة، وجميع الملفات موثقة.`,
  },
}

const I18nContext = createContext(null)

function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) 
    if (saved === 'en' || saved === 'ar') return saved
    if (navigator.language.startsWith('ar')) return 'ar'
  } catch {}
  return 'en'
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const isRtl = lang === 'ar'

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {}

    const root = document.documentElement
    root.setAttribute('dir', dir)
    root.setAttribute('lang', lang)
  }, [lang, dir])

  const setLang = (next) => {
    setLangState(next)
  }

  const toggleLang = () => {
    setLangState((cur) => (cur === 'en' ? 'ar' : 'en'))
  }

  const t = (key, defaultText) => {
    return translations[lang]?.[key] ?? translations.en[key] ?? defaultText ?? key
  }

  return (
    <I18nContext.Provider value={{ lang, dir, isRtl, setLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
