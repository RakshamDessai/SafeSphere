# 📋 SafeSphere — Official Hackathon Submission Pack
### SANKALP SETU – Student AI Hackathon 2026 (Institution Level)
**Under Seva Sankalp Abhiyan • Goa College of Engineering (GEC), Farmagudi, Ponda**
**Track 7:** Safety, Disaster Management and Community Resilience  
**Team:** Raksham Dessai (RD), Gangavarapu Kaarthikeya, Prathamesh Naik  

---

## 1. Google Form Ready-to-Copy Fields

### Team Details:
* **Team Name:** SafeSphere (Team Track 7)
* **Institution:** Goa College of Engineering (GEC), Farmagudi, Ponda
* **Team Members:**
  1. Raksham Dessai (Student ID / Year / Branch: TE Comp / GEC)
  2. Gangavarapu Kaarthikeya (Student ID / Year / Branch: TE Comp / GEC - Team Lead)
  3. Prathamesh Naik (Student ID / Year / Branch: GEC)
* **Faculty Mentor:** Prof. Balakrishna Chodankar / Prof. Madhuraj Naik (TIP / ESDC Coordinator)
* **Challenge Track:** Track 7 — Safety, Disaster Management and Community Resilience

### Problem Statement (Concise for Form):
> "In Goa's varied geographical landscape—from isolated hilly stretches like Farmagudi and Ponda to busy tourist beaches prone to rip currents—emergency response times for official services (Goa 112 and 108) average 15 to 25 minutes. In acute crises (assaults, late-night student transit distress, sudden medical emergencies), victims often suffer from the 'freeze response', rendering manual phone unlocking and landmark communication nearly impossible. There is no decentralized, hyper-local community mesh to bridge the first 3 to 5 critical minutes before formal authorities arrive."

### Proposed Solution Summary (Concise for Form):
> "SafeSphere is an AI-powered personal safety and community emergency response mesh. It features:
> 1. A Citizen Companion with tactile 1-tap SOS, hands-free Web Speech AI distress trigger ('Help me' / 'Bachao'), an Anti-Harassment Fake Call audio shield, SafeWalk virtual companion, and zero-internet SMS fallback.
> 2. A Sankalp Setu Guardian Network connecting verified campus security, EMTs, and local volunteers within 500m–2km to arrive on scene in under 3.5 minutes.
> 3. A Command & Control GIS Dashboard with an automated AI Threat Triage Engine (0–100% score) that categorizes incident severity and auto-dispatches to Goa 112 ERSS."

### AI & Generative AI Tools Disclosure (Mandatory Hackathon Guardrail):
> "AI Components:
> 1. Edge Web Speech Recognition API for continuous client-side distress keyword detection ('Help me', 'Bachao', 'Emergency').
> 2. Multi-factor NLP Threat Triage Engine scoring distress severity based on vocal urgency, device battery drain, time of day, and location vulnerability.
> 3. Speech Synthesis & Audio Synthesizer for procedural emergency alarm generation and interactive de-escalation dialogue.
> 4. Generative AI disclosure: Generative AI coding assistance used for rapid prototyping, UI scaffold, and synthetic scenario generation."

---

## 2. 3-Minute Live Pitch Script for the Judges

> **(Opening - 0:00 to 0:45)**  
> "Good morning, respected judges and professors. We are Team SafeSphere from GEC.  
> Imagine a female student walking back from the GEC library towards the hostel past 9:00 PM along an unlit stretch in Farmagudi. A suspicious vehicle circles her. Her heart races, she freezes. She cannot unlock her phone, find contacts, and explain her GPS coordinates over a call. Even if she dials 112, a patrol car will take 15 to 20 minutes to navigate through Ponda.  
> But right now, at the main gate, our campus security guard is just 300 meters away. A hostel guardian is 400 meters away. Why isn't there a bridge connecting them?"

> **(The Solution - 0:45 to 1:45)**  
> "Under the spirit of **Seva Sankalp Abhiyan**, we built **SafeSphere**—a hyper-local safety mesh that cuts response time from 18 minutes to **under 3.5 minutes**.  
> SafeSphere works through 3 interconnected layers:  
> 1. **For the Student/Citizen:** A single tap triggers an emergency beacon with a 3-second abort window. If she cannot touch her phone, our **Hands-Free AI Vocal Trigger** listens locally for cries like *'Help me'* or *'Bachao'*. If she feels cornered, she can activate our **Fake Call Shield**, which simulates an incoming call from 'Dad' complete with realistic voice audio saying *'I am outside the gate in the car'*, enabling safe de-escalation.  
> 2. **For the Community:** Nearby verified **Sankalp Setu Guardians**—campus marshals, NSS volunteers, and local residents—receive an instant geofenced ping with navigation and immediate first-aid protocols.  
> 3. **For Authorities:** A tactical Command Center monitors the entire Goa sector with real-time AI Threat Triage scoring."

> **(The Demo & Impact - 1:45 to 3:00)**  
> *(Show the live screen on localhost:5173)*  
> "Here is our working prototype. Watch as we trigger an SOS... notice the dual-tone audio deterrent siren and the live Leaflet map updating across the network.  
> SafeSphere requires zero expensive hardware, respects privacy with zero passive tracking, and includes an offline SMS fallback when there is no mobile data in the Ghats.  
> By turning citizens into guardians, SafeSphere brings true community resilience to Goa. Thank you!"

---

## 3. Step-by-Step Live Demo Walkthrough for Judges

1. **Step 1: Open `http://127.0.0.1:5173/` in your browser.**
2. **Step 2: Show the Citizen Companion tab:**
   * Point out the Goa Beacon Location selector (Farmagudi Campus, Ponda Market, Miramar, Calangute).
   * Tap the **SOS button** — highlight the 3-second abort countdown and audio beeps.
   * Tap **"Audio Siren"** — show the 100dB dual-frequency emergency alarm simulator.
   * Tap **"Simulate Incoming Call Now"** — show the realistic incoming call screen, answer it, and let the judges hear the synthesized voice dialogue.
3. **Step 3: Switch to "Setu Guardians" tab:**
   * Show the active emergency that was just triggered.
   * Click **"Accept & Rush to Scene"** and show the distance/ETA calculation.
   * Click **"Mark Safely Resolved"** and celebrate with the confetti animation!
4. **Step 4: Switch to "Command Center" tab:**
   * Show the dark-mode GIS Leaflet map with active SOS markers and safe havens.
   * Point to the **AI Threat Index gauge** (0–100%) and NLP extracted keywords.
   * Click **"Simulate Distress (Judge Demo)"** to demonstrate live real-time triage.
5. **Step 5: Switch to "Pitch Deck & Jury" tab:**
   * Flip through the 7 slides showing how SafeSphere satisfies every single one of the 100 evaluation points.

---

## 4. Tough Questions Judges Might Ask (and Winning Answers)

* **Q: "What if there is no internet in rural Goa or Western Ghats?"**  
  * **A:** "SafeSphere includes a zero-internet SMS fallback. One click generates an encrypted, pre-formatted SMS to 112 containing exact GPS coordinates and distress type that transmits over standard 2G GSM cellular towers."

* **Q: "What about user privacy? Are you constantly tracking students?"**  
  * **A:** "No. SafeSphere enforces strict privacy-by-design. Zero location data is tracked or transmitted while idle. Coordinates are only broadcasted when an active SOS is explicitly triggered or during an opted-in SafeWalk session. Furthermore, speech detection is executed strictly on-device via Web Speech API—no audio is recorded or stored."

* **Q: "How do you prevent false alarms and prank triggers?"**  
  * **A:** "We implemented a 3-second tactile and audio countdown that allows users to cancel accidental presses immediately. Furthermore, incidents require verified on-scene guardian confirmation to prevent malicious abuse."
