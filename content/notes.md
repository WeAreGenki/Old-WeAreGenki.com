+++
draft = true
title = "Notes"
+++

###############################
# NOTES ONLY - DO NOT PUBLISH #
###############################

## REDESIGN

+ [Ecommerce with a human touch]
+ ~~Remake website with a focus on just customer experience~~
    * ~~Ecommerce with focus on blended experience~~
    * REMAKE as a ecommerce network
        - Ref: http://www.envato.com
+ Rethink menu - ref: http://prty.jp/project.html?p=the-luxury-test
    * Home
    * Our sites - experiment with dedicated page vs on the homepage
        - Probably more towards the combined homepage with property listing because people wont understand otherwise
    * About us
    * The Experience
    * Work With Us / Careers
    * Community
    * Blog
    * Consulting & Workshops - maybe split into 2 pages/sections
    * Contact
        - Partnership requests/talking about
+ Rethink offerings
    * ~~CX [project overhaul/research package] - starting at $15000/month~~
    * Ecommerce and CX consulting, workshops - ~~move to MaxMilton.com~~ Keep here
        - Automation
    * Ecommerce content strategy
+ New process
    * Clear customer segmentation - customer personas - key first step in customer journey mapping, different customer segments make different journeys, this makes sure we're focusing on the right journey
    * Define customer goal
    * Customer journey mapping
    * Customer experience strategy development
        - Prioritise improvements
        - Focus on voice of the customer programs
        - Create offerings
        - Train employees
            * Non-verbals
    * Customer centric culture - customer journey thinking
    * Alternate/additional domains
        - genkicommerce.com - available
        - genkiretail.com - available
+ Ultra performance
    * JQuery free - still use smoothState.js (lead a project to remove jQuery dependency - see what particleground done) or find alternative (service worker + app shell?)
    * Focus on critical rendering path optimisations
        - Try critical CSS optimisations - try gulp-criticalcss
    * Big mobile optimisations
        - Responsive images - https://www.filamentgroup.com/lab/delivering-responsibly.html
    * Also look into accessibility optimisation - would be a good case study for my portfolio
    * Do performance testing of self-hosted fonts
* Full HTTPS site - HTTP2
    - Also use PUSH - probably makes things faster than even http - send resources before the browser requests them (push theme.css, all.js, icons.woff2)
* Service workers & app shell (try experimentation)
    - https://developers.google.com/web/updates/2015/11/app-shell
    - https://www.code-labs.io/codelabs/sw-precache/#0
    - Actually NOT a good idea for small/static size, maybe worth it for Magento sites though
    - How could this work with smoothstate.js
* Look into using the Google AMP project as a base - https://www.ampproject.org/

### Inspiration

+ http://fourhourworkweek.com/2015/10/13/the-nasty-icon-of-retail-sophia-amoruso/ - building ecommerce, experimentation/testing, business management, struggles with back end systems

### Design References

+ http://miguel-perez.github.io/smoothState.js/getting-started.html
    * Decide if we should keep smooth page transitions
    * Experiment with page transition animations
        - Homepage blue slide up
+ https://strategyzer.com/ - Nice landing page layouts
+ http://www.cooper.com/training/ - Basically what I want
+ https://basecamp.com/ - Hand drawn images & easily understandable copy
+ https://www.zirtual.com/ - Menu & page layout
+ http://www.morganstanley.com/ - Minimalist style, menu & font
+ http://www.dtelepathy.com/work/ - Copy
+ http://doyouimpress.com/ - Copy
+ http://thecreativemomentum.com/ - Nice minimal logo & use of black & white
+ http://neverbland.com/ - Great use of black & white and animations
+ http://www.kohactive.com/work/home-grown-cow/ - Excellent case study page
+ http://www.fullenglish.com/services/
+ http://truthlabs.com/about - images, copy, general vibe
+ http://www.cooper.com/journal/2015/6/exploration-a-tool-for-change-management - blog with large font size + narrow width
+ http://nodividestudio.com/what-we-do - fun consultancy, chic vibe, they emphasise being *remote*
+ https://www.filamentgroup.com/ - minimal, fast, also use Source Sans Pro font but in 300 weight, great use of brand colour (see their blog posts etc.)
+ https://citrusbyte.com/ - similar look to what I was going with the original wearegenki.com site
+ http://www.borngroup.com/ - Big, interactive fullscreen video
+ http://humaan.com/our-work/dusk/ - http://humaan.com/our-work/rottnest-island/ - nice single page experience
+ http://humaan.com/what-we-do/ - impressive animations

### Similar Companies

+ http://mappingexperiences.com/
+ http://razorfish.com.au/ - Nice header text
+ http://www.borngroup.com/ - Epic homepage intro + video
+ http://weareadaptable.com/studio/ - Nice about us copy
+ http://www.cooper.com/
+ https://pixeltogether.com/ - NSW based, done http://blackbird.vc/ site
+ http://www.netstarter.com.au/
+ http://wearejh.com/ - magento studio

## Other Ideas

+ What are the specific things potential customers are interested in?
    * Scaling their back end; scaling their business
    * Systems integration
+ Say something about Magento certification - might be a good sales point
+ Become a Google Partner and show image

## Web Server

+ CoreOS cluster on Google Cloud
    * 3 machines for high availability (f1-micro, ~$5 each x3 = ~$15)
    * Managed relational SQL (f1-micro, ~$10)
    * Load balancing (~$18)
    * Store CoreOS configs in cloud storage
    * Automated backups - disk snapshots
+ Cloudflare ($20 + $5 for each extra website)
+ Config files in a Google Cloud Storage container
+ NewRelic - https://github.com/newrelic-platform/docker_server_agent

## Landing Page Ideas

+ B2B
+ B2C
+ Enterprise
+ Startups
+ Workshops

## Ideas & Leftover Copy

[Using this insight we translate this into business results.], transform the data into clear actionable [tasks] [and implement change].

<!-- Nice quote style -->
<blockquote class="col-md-7 col-md-offset-1 pull-right">
    <p>"CX isn't something that can go on the wayside any longer. Today's brightest companies are taking advantage of CX."</p>
    <!-- <small>Someone famous in <cite title="Source Title">Source Title</cite></small> -->
</blockquote>

Your customers are a lot more than just lines in a spreadsheet. They're people who are looking for the perfect solution to their needs. The customer journey represents a scenario in which a customer might interact with your product or service. The ups and downs on the graph correspond to how they are feeling at any given point. 

[We use a process of] continuous innovation []. [Find out more] [Why Genki?]({{< relref "why-genki.md" >}} "Learn why We Are Genki is the answer")

going beyond "customer experience" as a slogan used in the boardroom, it should be considered an essential business discipline. When treated seriously, improving your customer experience can have significant economic impact and be a key factor for business growth.

CX can be complex at scale so we break it down and make things simple.

economic impact of improving customer experience

humanist, human, human touch, feel, feeling

how to differentiate yourself in a competitive industry

#CX can give huge results in enterprise environments, but that doesn't mean it's limited to that use case. Even startups and small business can use CX as a key factor in rapid business growth.

theorising is one thing, actionable intelligence is another
planning is one thing, but taking action is another

**Wait a second, isn't this just user Experience <span class="initialism">(UX)</span> design?** We often get this question because business leaders are finally embracing <span class="initialism">UX</span> design, but are only just starting to discover <span class="initialism">CX</span>. UX is looking at user interactions on your website. CX is looking at the entire journey from beginning to end at any point a customer interacts with your brand.

Every company is different and [demands] a unique approach. Our enterprise clients may need in depth customer research and cost reduction strategies. Our young startup clients might need forward thinking strategies on what their optimal customer experience might look like in the future.

We structure how we approach the unique [] of your company [in a unique way].
tailor fix for your [business|appraoch|strategy]

Expert Customer Experience <span class="initialism">(CX)</span> design for huge business growth and effortless conversions

We work with ecommerce and conversion orientated web companies. Our consultants provide the tools, strategies, and [] thinking you need to []. We use Customer Experience Design and business data at the core of all our decision making to [].

Get access to full-stack front-end design and detailed insight into improving your customer experience.

### Industries We [Service]

+ Telecommunications
+ Airlines, Travel, & Tourism
+ Food & beverage
+ Education
+ Not-for-profits
+ Fashion & beauty
+ Luxury
+ Technology services
+ Financial services
+ Government
+ Startups
+ Small business
+ Enterprise

# Interesting Snippets

We give you access to a killer team of designers, strategists and developers, all working together to achieve your business objectives. The ultimate in agility and flexibility, everything's in scope and there are never change orders. Starting at $25,000/month.  
↳ http://www.dtelepathy.com/work/

"The impact that customer journey mapping can have for a business should not be underestimated. Customer journey maps provide the framework that enables a business to look at the holistic customer experience through one lens and create a customer-centric culture for change. Allowing everyone across the business to understand exactly what the 'as is' experience looks like today, establish how the journey should be re-designed in line with customer needs and their role in creating a superior customer experience."  
↳ http://www.nunwood.com/customer-journey-mapping-how-a-solid-customer-journey-map-can-be-essential-to-a-brands-success/

She helps executives co-create innovative products, services, and experiences that truly matter -- for their customers, for their employees, and for their business.  
↳ http://kerrybodine.com/about/

**Business Value of CX** - Why has CX become a strategic imperative for today's top executives?

**Brand Promises** - How can you deliver on the implicit and explicit expectations set by your brand?

**CX Design** - What new ways of thinking and working will help you intentionally create great customer experiences?  
↳ http://kerrybodine.com/speaking/
