<template>
    <div>
        <a-form
            id="formLogin"
            class="user-layout-login"
            ref="formLogin"
            :form="form"
            @submit="handleSubmit"
        >
            <a-tabs
                :activeKey="customActiveKey"
                :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
                @change="handleTabClick"
            >
                <!-- 账号密码登录 -->
                <a-tab-pane key="tab1">
                    <span slot="tab">
                        <a-icon type="user"/>
                        {{ $t('user.login.tab-login-credentials') }}
                    </span>
                    <a-alert
                        v-if="isLoginError"
                        type="error"
                        showIcon
                        style="margin-bottom: 24px"
                        :message="this.accountLoginErrMsg"
                    />
                    <a-form-item v-if="tenantOpen">
                        <a-select
                            style="width: 100%"
                            size="large"
                            placeholder="请选择租户"
                            v-decorator="[
                                'tenantCode',
                                { rules: [{ required: true, message: '请选择租户！' }] },
                            ]"
                        >
                            <a-select-option
                                v-for="(item, index) in tenantsList"
                                :key="index"
                                :value="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <a-input
                            size="large"
                            type="text"
                            :placeholder="$t('user.login.username.placeholder')"
                            v-decorator="[
                                'account',
                                {
                                    rules: [
                                        { required: true, message: $t('user.login.message-require-credentials') },
                                        { validator: handleUsernameOrEmail },
                                    ],
                                    validateTrigger: 'change',
                                },
                            ]"
                        >
                            <a-icon
                                slot="prefix"
                                type="user"
                                :style="{ color: 'rgba(0,0,0,.25)' }"
                            />
                        </a-input>
                    </a-form-item>

                    <a-form-item>
                        <a-input-password
                            size="large"
                            autocomplete="false"
                            :placeholder="$t('user.login.password.placeholder')"
                            v-decorator="[
                                'password',
                                {
                                    rules: [{ required: true, message: $t('user.login.message-require-password') }],
                                    validateTrigger: 'blur',
                                },
                            ]"
                        >
                            <a-icon
                                slot="prefix"
                                type="lock"
                                :style="{ color: 'rgba(0,0,0,.25)' }"
                            />
                        </a-input-password>
                    </a-form-item>

                    <a-row :gutter="16">
                        <a-col class="gutter-row" :span="14">
                            <a-form-item>
                                <a-input
                                    size="large"
                                    type="text"
                                    :placeholder="$t('user.login.captcha.placeholder')"
                                    v-decorator="[
                                        'code',
                                        {
                                            rules: [{ required: true, message: $t('user.login.message-require-captcha') }],
                                            validateTrigger: 'blur',
                                        },
                                    ]"
                                >
                                    <a-icon
                                        slot="prefix"
                                        type="mail"
                                        :style="{ color: 'rgba(0,0,0,.25)' }"
                                    />
                                </a-input>
                            </a-form-item>
                        </a-col>
                        <a-col class="gutter-row" :span="10">
                            <div class="login-code">
                                <img :src="codeUrl" @click="getCode"/>
                            </div>
                        </a-col>
                    </a-row>
                </a-tab-pane>

                <!-- 手机号登录 -->
                <a-tab-pane key="tab2">
                    <span slot="tab">
                        <a-icon type="mobile"/>
                        {{ $t('user.login.tab-login-mobile') }}
                    </span>
                    <a-alert
                        v-if="isLoginError"
                        type="error"
                        showIcon
                        style="margin-bottom: 24px"
                        :message="this.accountLoginErrMsg"
                    />
                    <a-form-item v-if="tenantOpen">
                        <a-select
                            style="width: 100%"
                            size="large"
                            placeholder="请选择租户"
                            v-decorator="[
                                'tenantCode',
                                { rules: [{ required: true, message: '请选择租户！' }] },
                            ]"
                        >
                            <a-select-option
                                v-for="(item, index) in tenantsList"
                                :key="index"
                                :value="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <a-input
                            size="large"
                            type="text"
                            :placeholder="$t('user.login.mobile.placeholder')"
                            v-decorator="[
                                'mobile',
                                {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^1[34578]\d{9}$/,
                                            message: $t('user.login.mobile-invalid'),
                                        },
                                    ],
                                    validateTrigger: 'change',
                                },
                            ]"
                        >
                            <a-icon
                                slot="prefix"
                                type="mobile"
                                :style="{ color: 'rgba(0,0,0,.25)' }"
                            />
                        </a-input>
                    </a-form-item>

                    <a-row :gutter="16">
                        <a-col class="gutter-row" :span="16">
                            <a-form-item>
                                <a-input
                                    size="large"
                                    type="text"
                                    :placeholder="$t('user.login.mobile.verification-code.placeholder')"
                                    v-decorator="[
                                        'smsCode',
                                        {
                                            rules: [{ required: true, message: $t('user.login.verification-code-invalid') }],
                                            validateTrigger: 'blur',
                                        },
                                    ]"
                                >
                                    <a-icon
                                        slot="prefix"
                                        type="mail"
                                        :style="{ color: 'rgba(0,0,0,.25)' }"
                                    />
                                </a-input>
                            </a-form-item>
                        </a-col>
                        <a-col class="gutter-row" :span="8">
                            <a-button
                                class="getCaptcha"
                                tabindex="-1"
                                :disabled="state.smsSendBtn"
                                @click.stop.prevent="getCaptcha"
                                v-text="
                                    (!state.smsSendBtn && $t('user.register.get-verification-code')) || state.time + ' s'
                                "
                            ></a-button>
                        </a-col>
                    </a-row>
                </a-tab-pane>

                <!-- 微信登录 -->
                <a-tab-pane key="wechat">
                    <span slot="tab">
                        <a-icon type="wechat"/>
                        {{ $t('user.login.tab-login-wx') }}
                    </span>
                    <iframe
                        ref="wechat"
                        class="wechat-iframe"
                        sandbox="allow-top-navigation allow-scripts allow-same-origin"
                        :src="`${socialLoginUrl}/WECHAT_OPEN`"
                    />
                </a-tab-pane>
            </a-tabs>

            <template v-if="customActiveKey !== 'wechat'">
                <a-form-item>
                    <a-checkbox
                        v-decorator="['rememberMe', { valuePropName: 'checked' }]"
                    >
                        {{ $t('user.login.remember-me') }}
                    </a-checkbox>
                    <router-link
                        :to="{ name: 'recover', params: { user: 'aaa' } }"
                        class="forge-password"
                        style="float: right"
                    >
                        {{ $t('user.login.forgot-password') }}
                    </router-link>
                </a-form-item>

                <a-form-item style="margin-top: 24px">
                    <a-button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        class="login-button"
                        :loading="btnLoading"
                        :disabled="btnLoading"
                    >
                        {{ $t('user.login.login') }}
                    </a-button>
                </a-form-item>
            </template>

            <div class="user-login-other">
                <span>{{ $t('user.login.sign-in-with') }}</span>
                <a>
                    <a-icon class="item-icon" type="taobao-circle"></a-icon>
                </a>
                <a>
                    <a-icon class="item-icon" type="weibo-circle"></a-icon>
                </a>
                <router-link class="register" :to="{ name: 'register' }">
                    {{ $t('user.login.signup') }}
                </router-link>
            </div>
        </a-form>

        <two-step-captcha
            v-if="requiredTwoStepCaptcha"
            :visible="stepCaptchaVisible"
            @success="stepCaptchaSuccess"
            @cancel="stepCaptchaCancel"
        />
    </div>
</template>

<script>
    import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha';
    import { mapActions } from 'vuex';
    import { getSmsCaptcha, getCodeCaptcha } from '@/api/modular/system/loginManage';
    import { socialLoginUrl } from '@/config/net.config';

    export default {
        name: 'UserLogin',
        components: {
            TwoStepCaptcha,
        },
        data() {
            return {
                socialLoginUrl,
                customActiveKey: 'tab1',
                btnLoading: false,
                // login type: 0 email, 1 username, 2 telephone
                loginType: 0,
                isLoginError: false,
                requiredTwoStepCaptcha: false,
                stepCaptchaVisible: false,
                form: this.$form.createForm(this),
                state: {
                    time: 60,
                    // login type: 0 email, 1 username, 2 telephone
                    loginType: 0,
                    smsSendBtn: false,
                },
                accountLoginErrMsg: '',
                tenantOpen: false,
                tenantsList: [],
                codeUrl: '',
            };
        },
        created() {
            this.getCode();
        },
        methods: {
            ...mapActions(['Login', 'MobileLogin', 'Logout', 'dictTypeData']),
            // handler
            handleUsernameOrEmail(rule, value, callback) {
                const { state } = this;
                const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
                if (regex.test(value)) {
                    state.loginType = 0;
                } else {
                    state.loginType = 1;
                }
                callback();
            },
            handleTabClick(key) {
                this.isLoginError = false;
                this.customActiveKey = key;
                // this.form.resetFields()
            },
            handleSubmit(e) {
                e.preventDefault();
                const {
                    form: { validateFields },
                    state,
                    customActiveKey,
                    Login,
                    MobileLogin,
                } = this;

                this.btnLoading = true;

                const validateFieldsKey = customActiveKey === 'tab1' ? ['account', 'password', 'code'] : ['mobile', 'smsCode'];
                if (this.tenantOpen) {
                    validateFieldsKey.push('tenantCode');
                }
                if (customActiveKey === 'tab1') {
                    validateFields(validateFieldsKey, { force: true }, (err, values) => {
                        if (!err) {
                            const loginParams = { ...values };
                            delete loginParams.account;
                            loginParams[!state.loginType ? 'email' : 'account'] = values.account;
                            loginParams.password = values.password;
                            loginParams.code = values.code;
                            loginParams.key = this.form.key;
                            if (this.tenantOpen) {
                                loginParams.tenantCode = values.tenantCode;
                            }
                            Login(loginParams)
                                .then(res => this.loginSuccess(res))
                                .catch(this.getCode)
                                .finally(() => {
                                    this.btnLoading = false;
                                });
                        } else {
                            setTimeout(() => {
                                this.btnLoading = false;
                            }, 600);
                        }
                    });
                } else {
                    validateFields(validateFieldsKey, { force: true }, (err, values) => {
                        if (!err) {
                            const loginParams = { ...values };
                            delete loginParams.mobile;
                            loginParams.mobile = values.mobile;
                            loginParams.code = values.smsCode;
                            MobileLogin(loginParams)
                                .then(res => this.loginSuccess(res))
                                .catch(err => this.requestFailed(err))
                                .finally(() => {
                                    this.btnLoading = false;
                                });
                        } else {
                            setTimeout(() => {
                                this.btnLoading = false;
                            }, 600);
                        }
                    });
                }
            },
            getCode() {
                getCodeCaptcha().then(res => {
                    if (res) {
                        this.codeUrl = res.data.codeUrl;
                        this.form.key = res.data.key;
                    }
                });
            },
            getCaptcha(e) {
                e.preventDefault();
                const {
                    form: { validateFields },
                    state,
                } = this;

                validateFields(['mobile'], { force: true }, (err, values) => {
                    if (!err) {
                        state.smsSendBtn = true;

                        const interval = window.setInterval(() => {
                            if (state.time-- <= 0) {
                                state.time = 60;
                                state.smsSendBtn = false;
                                window.clearInterval(interval);
                            }
                        }, 1000);

                        const hide = this.$message.loading('验证码发送中..', 0);
                        getSmsCaptcha({ mobile: values.mobile })
                            .then(res => {
                                setTimeout(hide, 2500);
                                this.$notification['success']({
                                    message: '提示',
                                    description: '验证码发送成功',
                                    duration: 8,
                                });
                            })
                            .catch(err => {
                                setTimeout(hide, 1);
                                clearInterval(interval);
                                state.time = 60;
                                state.smsSendBtn = false;
                                this.requestFailed(err);
                            });
                    }
                });
            },
            stepCaptchaSuccess() {
                this.loginSuccess();
            },
            stepCaptchaCancel() {
                this.Logout().then(() => {
                    this.btnLoading = false;
                    this.stepCaptchaVisible = false;
                });
            },
            loginSuccess() {
                this.$router.push({ path: '/' });
                this.isLoginError = false;
                // 加载字典所有字典到缓存中
                this.dictTypeData();
            },
            requestFailed(err) {
                this.accountLoginErrMsg = err;
                this.isLoginError = true;
            },
        },
    };
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}

.wechat-iframe {
  width: 100%;
  border: 0;
  min-height: 400px;
}
</style>
