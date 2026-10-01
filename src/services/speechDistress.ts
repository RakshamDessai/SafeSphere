// Web Speech API Voice Distress Detection Service

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: unknown) => void;
  onend: () => void;
}

type SpeechDistressCallback = (triggerWord: string, fullTranscript: string) => void;

class SpeechDistressService {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening = false;
  private onTriggerCallback: SpeechDistressCallback | null = null;

  // Multi-lingual distress keywords (English & Hindi/Konkani)
  private distressKeywords = [
    'help me',
    'help',
    'bachao',
    'save me',
    'emergency',
    'stop please',
    'police',
    'ambulance',
    'danger',
    'attack',
    'madat kara'
  ];

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition: new () => SpeechRecognitionInstance }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-IN'; // Indian English / accent friendly

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript.toLowerCase();
            for (const keyword of this.distressKeywords) {
              if (transcript.includes(keyword)) {
                if (this.onTriggerCallback) {
                  this.onTriggerCallback(keyword, transcript);
                }
                break;
              }
            }
          }
        };

        this.recognition.onerror = (err) => {
          console.warn('Speech recognition error:', err);
        };

        this.recognition.onend = () => {
          if (this.isListening) {
            try {
              this.recognition?.start();
            } catch {
              // Ignore restart error
            }
          }
        };
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
  }

  isSupported(): boolean {
    return !!(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );
  }

  startListening(callback: SpeechDistressCallback) {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) return;

    this.onTriggerCallback = callback;
    this.isListening = true;

    try {
      this.recognition.start();
    } catch {
      // Already running or permission needed
    }
  }

  stopListening() {
    this.isListening = false;
    this.onTriggerCallback = null;
    try {
      this.recognition?.stop();
    } catch {
      // Ignored
    }
  }

  getListeningStatus(): boolean {
    return this.isListening;
  }
}

export const speechDistressService = new SpeechDistressService();
