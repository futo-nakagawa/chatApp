<template>
    <div class="login">
        <h2>ログイン</h2>
        <input v-model="email" type="text" name="email" placeholder="example@email.com">
        <input v-model="password" type="text" name="password" placeholder="password">
        <button @click="login">ログイン</button>
        <button @click="signup">サインアップ</button>
    </div>
</template>