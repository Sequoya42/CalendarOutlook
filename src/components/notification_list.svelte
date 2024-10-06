<script lang="ts">
    import Notification  from '$components/notification.svelte'

    import { notifications } from '$store';
</script>

<div class="notification-list">
    {#each $notifications as { id, type, message }}
        <Notification {id} {type} {message} />
    {/each}
</div>

<style>
    .notification-list {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        width: 300px;
    }
</style>