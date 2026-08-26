import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  FirebaseUser
} from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { User, Application, AuditRun } from '../types';
import { store } from './store';

export class AuthService {
  private currentUser: User | null = null;
  private unsubscribeAuth: Unsubscribe | null = null;
  private unsubscribeFirestoreUser: Unsubscribe | null = null;

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    this.unsubscribeAuth = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          // Fetch or initialize user profile from Firestore
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          let appUser: User;
          if (userDoc.exists()) {
            appUser = userDoc.data() as User;
          } else {
            // Create user document in Firestore
            appUser = {
              id: fbUser.uid,
              email: fbUser.email || 'developer@apple.dev',
              name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'iOS Developer'),
              role: 'developer',
              tier: 'pro',
              teamName: 'Apple Developer Team',
              appleTeamId: 'DEV' + Math.random().toString(36).substring(2, 8).toUpperCase(),
              avatarUrl: fbUser.photoURL || undefined,
              token: await fbUser.getIdToken(),
              createdAt: new Date().toISOString(),
              settings: {
                notificationsEnabled: true,
                autoRecheckOnUpload: true,
                defaultExportFormat: 'markdown',
                apiKey: 'ar_pk_live_' + Math.random().toString(36).substring(2, 12)
              }
            };
            await setDoc(userDocRef, appUser);
          }

          this.currentUser = appUser;
          store.setUser(appUser);
          this.listenToUserDocument(fbUser.uid);
        } catch (err) {
          console.warn('Error reading user profile from Firestore, using auth fallback:', err);
          const fallbackUser: User = {
            id: fbUser.uid,
            email: fbUser.email || 'developer@apple.dev',
            name: fbUser.displayName || 'iOS Developer',
            role: 'developer',
            tier: 'pro',
            teamName: 'Apple Developer Team',
            appleTeamId: 'APL982019',
            avatarUrl: fbUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
            settings: {
              notificationsEnabled: true,
              autoRecheckOnUpload: true,
              defaultExportFormat: 'markdown'
            }
          };
          this.currentUser = fallbackUser;
          store.setUser(fallbackUser);
        }
      } else {
        this.currentUser = null;
        if (this.unsubscribeFirestoreUser) {
          this.unsubscribeFirestoreUser();
          this.unsubscribeFirestoreUser = null;
        }
        // Note: Store will keep its local sandbox user or null
      }
    });
  }

  private listenToUserDocument(userId: string) {
    if (this.unsubscribeFirestoreUser) {
      this.unsubscribeFirestoreUser();
    }
    const userDocRef = doc(db, 'users', userId);
    this.unsubscribeFirestoreUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const updated = docSnap.data() as User;
        this.currentUser = updated;
        store.setUser(updated);
      }
    }, (error) => {
      console.warn('Firestore user listener notice:', error.message);
    });
  }

  // Real Google Single Sign-On
  public async signInWithGoogle(): Promise<User> {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userDocRef);

    let appUser: User;
    if (userDoc.exists()) {
      appUser = userDoc.data() as User;
    } else {
      appUser = {
        id: fbUser.uid,
        email: fbUser.email || 'developer@gmail.com',
        name: fbUser.displayName || 'iOS Developer',
        role: 'developer',
        tier: 'pro',
        teamName: 'Apple Developer Team',
        appleTeamId: 'APL' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        avatarUrl: fbUser.photoURL || undefined,
        token: await fbUser.getIdToken(),
        createdAt: new Date().toISOString(),
        settings: {
          notificationsEnabled: true,
          autoRecheckOnUpload: true,
          defaultExportFormat: 'markdown',
          apiKey: 'ar_pk_live_' + Math.random().toString(36).substring(2, 12)
        }
      };
      await setDoc(userDocRef, appUser);
    }

    this.currentUser = appUser;
    store.setUser(appUser);
    return appUser;
  }

  // Real Email & Password Registration
  public async registerWithEmail(
    email: string, 
    pass: string, 
    name: string, 
    tier: 'free' | 'pro' | 'studio' = 'pro',
    appleTeamId?: string,
    teamName?: string
  ): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = cred.user;

    if (name) {
      await updateProfile(fbUser, { displayName: name });
    }

    const appUser: User = {
      id: fbUser.uid,
      email: fbUser.email || email,
      name: name || email.split('@')[0],
      role: 'developer',
      tier,
      teamName: teamName || 'Indie Studio',
      appleTeamId: appleTeamId || 'DEV' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      token: await fbUser.getIdToken(),
      createdAt: new Date().toISOString(),
      settings: {
        notificationsEnabled: true,
        autoRecheckOnUpload: true,
        defaultExportFormat: 'markdown',
        apiKey: 'ar_pk_live_' + Math.random().toString(36).substring(2, 12)
      }
    };

    const userDocRef = doc(db, 'users', fbUser.uid);
    await setDoc(userDocRef, appUser);

    this.currentUser = appUser;
    store.setUser(appUser);
    return appUser;
  }

  // Real Email & Password Login
  public async loginWithEmail(email: string, pass: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = cred.user;

    const userDocRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userDocRef);

    let appUser: User;
    if (userDoc.exists()) {
      appUser = userDoc.data() as User;
    } else {
      appUser = {
        id: fbUser.uid,
        email: fbUser.email || email,
        name: fbUser.displayName || email.split('@')[0],
        role: 'developer',
        tier: 'pro',
        teamName: 'Apple Developer Team',
        appleTeamId: 'APL982019',
        token: await fbUser.getIdToken(),
        createdAt: new Date().toISOString(),
        settings: {
          notificationsEnabled: true,
          autoRecheckOnUpload: true,
          defaultExportFormat: 'markdown',
          apiKey: 'ar_pk_live_' + Math.random().toString(36).substring(2, 12)
        }
      };
      await setDoc(userDocRef, appUser);
    }

    this.currentUser = appUser;
    store.setUser(appUser);
    return appUser;
  }

  // Real Password Reset Email
  public async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  // Real Sign Out
  public async signOut(): Promise<void> {
    await fbSignOut(auth);
    this.currentUser = null;
    store.setUser(null);
  }

  // Sync profile update to Firestore
  public async updateUserProfile(updates: Partial<User>): Promise<void> {
    if (!this.currentUser) return;
    const uid = this.currentUser.id;
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, updates as Record<string, any>);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const authService = new AuthService();
