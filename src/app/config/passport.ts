import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs"
import AppError from "../errorHalper/App.Error";
import httpStatus from "http-status-codes"

// Local Stregy
passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {

            const isUserExites = await User.findOne({ email })
            if (!isUserExites) {
                return done(null, false, { message: "User does not exist" })
            }
            if (!isUserExites.isVerified) {
                return done("User is verified")
            }
            if (isUserExites.isActive === IsActive.BLOCKED || isUserExites.isActive === IsActive.INACTIVE) {
                return done(`User is ${isUserExites.isActive}`)
            }
            if (isUserExites.isDeleted) {
                return done(`User is deleted`)
            }


            // google authenticate hole password check korte hobe na
            const isGoogleAuthentication = isUserExites.auths.some((providerObjects => providerObjects.provider == "google"))
            if (isGoogleAuthentication && !isUserExites.password) {
                return done(null, false, { message: "You have authenticated through Google.So if you want to login with credentials,then at first login with google and set a password for your Gmail and then you login with email and password" })
            }

            const isPasswordMatched = await bcryptjs.compare(password as string, isUserExites.password as string)

            if (!isPasswordMatched) {
                return done(null, false, { message: "Password does not match" })
            }
            return done(null, isUserExites)

        } catch (error) {
            console.log(error)
            done(error)
        }
    })
)

// Google er jonno
passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value
                if (!email) {
                    return done(null, false, { message: "No email found " })
                }
                let isUserExites = await User.findOne({ email })
                if (isUserExites && !isUserExites.isVerified) {
                    return done(null, false, { message: "User is not verified" })
                }
                if (isUserExites && (isUserExites.isActive === IsActive.BLOCKED || isUserExites.isActive === IsActive.INACTIVE)) {

                    return done(null,false,{message:`User is ${isUserExites.isActive}`})
                }
                if (isUserExites && isUserExites.isDeleted) {
                    return done(null,false,{message:`User is deleted`})
                }
                if (!isUserExites) {
                    isUserExites = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                }
                return done(null, isUserExites)
            } catch (error) {
                console.log("Google Strategy Error", error)
                return done(error)
            }
        }
    )
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)

})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})