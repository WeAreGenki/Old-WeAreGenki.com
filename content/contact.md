+++
date = "2015-05-25T00:00:00+10:00"
title = "Contact"
description = "Contact We Are Genki, customer experience consultants."

[menu.footer]
    name = "Contact"
    weight = 20
+++

<div class="text-center">
    <span class="i i-mail" aria-hidden="true"></span>
    <h1 class="title"><a href="{{< relref "contact.md" >}}">Contact Us</a></h1>
</div>

<form role="form" action="https://docs.google.com/a/ravegear.co/forms/d/1J_TGMpHP4-PIUaDeMfmlAFnMgEY5YEYrEizhO17r-CU/formResponse" method="POST" id="contact-form" target="_self" onsubmit="ga('send','event','contact','click','form', {useBeacon: true});">
    <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" name="entry.720601099" id="name" placeholder="Full Name">
    </div>
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" class="form-control" name="entry.802729023" id="email" placeholder="email@example.com">
    </div>
    <div class="form-group">
        <label for="message">What&rsquo;s your project objective? <small>(or support question)</small></label>
        <textarea class="form-control" name="entry.538104162" id="message" rows="4" placeholder="My company example.com has an 80% cart abandonment rate and a poor customer experience. I feels there's a lot of missed opportunity so I want you to look over our CX strategy, increase conversion rates, and &hellip;"></textarea>
    </div>
    <button type="submit" class="btn btn-primary btn-lg btn-block">Send Message</button>
</form>

<p class="text-center">Don't want to fill in a form?<br/>
Send an email to <a href="mailto:max@wearegenki.com" onClick="ga('send','event','contact','click','email', {useBeacon: true});">max@wearegenki.com</a>.</p>
