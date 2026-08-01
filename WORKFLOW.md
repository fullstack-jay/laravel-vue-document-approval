Tentu. Saya akan membuatnya dengan format yang bisa langsung Anda tempel ke **Claude Code** agar Claude dapat memahami requirement secara menyeluruh sebelum mulai mengembangkan aplikasi.

---

# Business Process Explanation

## Overview

A government institution uses a **Document Approval System** to manage document submission requests from applicants.

There are **2 main roles**:

1. Applicant (Pemohon)
2. Reviewer (Penilai/Penguji)

Every document request must go through an approval workflow before becoming an approved document.

The workflow supports:

* Draft
* Submission
* Review
* Revision
* Approval
* Rejection

The system must store every action as an audit trail because the application may contain hundreds of thousands to millions of records.

---

# Actors

## 1. Applicant

Applicant is responsible for:

* Register
* Login
* Create a project/application
* Upload supporting documents
* Edit application while still Draft
* Submit application
* Receive revision request
* Update documents
* Resubmit application
* Receive approval
* Receive rejection

---

## 2. Reviewer

Reviewer is responsible for:

* Login
* View submitted applications
* Review documents
* Add review notes
* Request revision
* Approve application
* Reject application
* View review history

---

# Workflow

## Step 1

Applicant prepares all required documents.

No application exists yet.

---

## Step 2

Applicant logs into the system.

If no account exists:

Register

Otherwise:

Login

---

## Step 3

Applicant creates a new Project/Application.

Initial status:

Draft

Applicant can:

* edit data
* upload files
* delete uploaded files
* save draft

Draft applications are **not visible** to reviewers.

---

## Step 4

Applicant submits application.

Status changes

Draft

↓

Submitted

Reviewer can now see the application.

Applicant can no longer edit data directly.

---

## Step 5

Reviewer receives notification.

Reviewer opens the application.

Reviewer checks:

* applicant information
* uploaded documents
* project information

---

## Step 6

Reviewer performs review.

Reviewer writes review notes.

Then reviewer chooses one of three decisions.

---

### Decision A

Approved

Status

Submitted

↓

Approved

System:

Generate approval record.

Application becomes read-only.

Applicant receives notification.

Workflow ends.

---

### Decision B

Revision Required

Status

Submitted

↓

Revision

Reviewer must write revision notes.

Applicant receives notification.

Applicant edits project.

Applicant uploads corrected documents.

Applicant submits again.

Status

Revision

↓

Submitted

Application returns to reviewer.

This cycle may happen multiple times.

---

### Decision C

Rejected

Status

Submitted

↓

Rejected

Reviewer writes rejection reason.

Applicant receives notification.

Application is permanently closed.

Applicant cannot edit the application anymore.

If applicant wants to continue, they must create a new application.

---

# Status Flow

Draft

↓

Submitted

↓

Review

↓

Approved

OR

Revision

↓

Submitted

↓

Review

↓

Approved

OR

Rejected

---

# Permissions

## Applicant

Can:

Create application

Edit Draft

Upload files

View own applications

View status

View revision history

View review notes

Cannot:

Approve

Reject

Review other applications

Edit Submitted application

---

## Reviewer

Can:

View submitted applications

Review

Approve

Reject

Request revision

Write notes

View history

Cannot:

Edit applicant data

Create application

---

# Audit Log

Every important action must be recorded.

Examples

Application Created

Document Uploaded

Application Updated

Application Submitted

Review Started

Revision Requested

Application Resubmitted

Approved

Rejected

Each log stores:

timestamp

user

action

description

IP (optional)

---

# Notification

Applicant receives notification when:

Application submitted successfully

Revision requested

Application approved

Application rejected

Reviewer receives notification when:

New application submitted

Applicant resubmitted revised application

---

# File Upload

Applicant uploads:

PDF

DOC

DOCX

Maximum size:

10 MB

Files are stored securely.

Only owner and reviewer can access files.

---

# Performance Requirements

The system should support:

10,000+ applications

2,000 users

Fast dashboard

Pagination

Filtering

Searching

Indexing

Eager loading

Caching

---

# Security

Authentication:

Laravel Sanctum

Authorization:

Role Permission (Spatie)

Policies

Validation

CSRF Protection

SQL Injection Protection

File validation

---

# REST API Modules

Authentication

Projects

Applications

Documents

Reviews

Approval

Revision

Users

Dashboard

Logs

Notifications

---

# Suggested Database Tables

users

roles

permissions

projects

applications

application_documents

reviews

review_notes

approval_logs

notifications

activity_logs

---

# Product Requirement Document (PRD)

# Product Requirement Document

## Project Name

Document Approval Management System

---

## Purpose

Build a web-based document approval platform where applicants submit document requests and reviewers evaluate them through a structured approval workflow.

The system must be scalable, secure, and optimized for handling large datasets.

---

## Goals

* Digitalize document submission
* Reduce manual approval process
* Track complete approval history
* Support revisions
* Maintain audit logs
* Provide dashboard insights

---

# User Roles

## Applicant

### Features

Authentication

Dashboard

Create Project

Upload Documents

Save Draft

Submit Application

View Status

View Review Notes

View Revision History

View Notifications

---

## Reviewer

### Features

Authentication

Dashboard

View Submitted Applications

Review Documents

Add Notes

Approve

Reject

Request Revision

View Review History

Dashboard Analytics

---

# Functional Requirements

## Authentication

Register

Login

Logout

Forgot Password

Role-based Access

---

## Project

Create

Update

Delete Draft

View Detail

List Projects

Search

Pagination

---

## Document

Upload

Download

Preview

Delete (Draft only)

Validation

---

## Application

Submit

Track Status

History

Revision

Approval

Reject

---

## Review

View Queue

Open Detail

Write Notes

Approve

Reject

Revision Request

---

## Dashboard

Applicant

Number of Applications

Draft

Submitted

Approved

Rejected

Revision

---

Reviewer Dashboard

Pending Review

Approved Today

Rejected Today

Revision Today

Monthly Statistics

Charts

---

## Audit Log

Store:

Action

User

Timestamp

Description

Old Value

New Value

---

# Non Functional Requirements

Laravel 12

Vue 3

PostgreSQL

REST API

Sanctum

Spatie Permission

Docker

Redis Cache

Queue

Responsive Design

PSR-12

Unit Test

Feature Test

OpenAPI Documentation

---

# Success Criteria

* Applicant can submit applications.
* Reviewer can review, approve, reject, or request revisions.
* Complete history is recorded.
* Dashboard loads quickly even with 10,000+ applications.
* REST API follows best practices.
* Source code is clean, modular, and maintainable.
* Authentication and authorization are secure.

---

## Prompt untuk Claude Code

> Build a production-ready full-stack Document Approval Management System using Laravel 12 (REST API), Vue 3, PostgreSQL, Sanctum Authentication, Spatie Permission, Docker, Redis Cache, Queue, and Chart.js. Implement a complete approval workflow consisting of Draft → Submitted → Review → Approved / Revision / Rejected. Applicants can create projects, upload documents, edit drafts, submit applications, receive revision requests, and monitor approval history. Reviewers can review submissions, add notes, approve, reject, or request revisions. Maintain a complete audit log for every action, optimize the application for at least 10,000 applications and 2,000 users using indexing, eager loading, pagination, and caching, and follow Clean Architecture, SOLID principles, PSR-12, Repository-Service pattern, API Resources, Form Requests, Policies, Feature Tests, and a responsive modern UI with reusable Vue components.
