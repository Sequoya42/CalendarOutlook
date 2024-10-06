<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import NotificationList from '$components/notification_list.svelte';
    import { addNotification } from '$store';

    // List of required fields and their types
    const requiredFields = {
        workStatus: 'string',
        address: 'string',
        taxNumber: 'string',
        disclaimer: 'string',
        ratePerDay: 'number',
        taxDisclaimer: 'string',
        IBAN: 'string',
        SWIFT: 'string',
        BANK: 'string',
        jobTitle: 'string',
        reference: 'string',
        recipientName: 'string',
        recipientTitle: 'string',
        recipientCompany: 'string',
        recipientAddress: 'string',
        recipientCountry: 'string',
        recipientLicense: 'string'
    };

    // Generate initial profileData object from requiredFields
    const createInitialProfile = () => {
        const profile = {};
        for (const [key, type] of Object.entries(requiredFields)) {
            if (type === 'number') {
                profile[key] = 0; // Default number value
            } else {
                profile[key] = ''; // Default string value
            }
        }
        return profile;
    };

    let profileData = createInitialProfile();

    let showJson = writable(false);
    const jsonText = writable('');
    const jsonError = writable('');

    // Load profile data from localStorage
    onMount(() => {
        const storedProfile = localStorage.getItem('profileData');
        if (storedProfile) {
            try {
                profileData = JSON.parse(storedProfile);
                jsonText.set(JSON.stringify(profileData, null, 2));
            } catch (error) {
                console.error('Error parsing stored profile data:', error);
            }
        } else {
            jsonText.set(JSON.stringify(profileData, null, 2));
        }
    });

    // Function to validate the JSON structure
    function validateJsonStructure(data) {
        for (const [key, type] of Object.entries(requiredFields)) {
            if (!data.hasOwnProperty(key) || typeof data[key] !== type) {
                return false;
            }
        }
        return true;
    }

    // Save profile data to localStorage
    function saveProfile() {
        try {
            const parsedData = JSON.parse($jsonText);
            if (!validateJsonStructure(parsedData)) {
                throw new Error('Invalid JSON structure. Please ensure all fields are present and correctly named.');
            }
            profileData = parsedData;
            localStorage.setItem('profileData', JSON.stringify(profileData));
            addNotification('success', 'Profile saved successfully!');
        } catch (e) {
            addNotification('error', `${e.message}`);
        }
    }

    function toggleView() {
        showJson.update(show => !show);
    }

    // Handle JSON input change
    function handleJsonChange(event) {
        try {
            const parsedData = JSON.parse(event.target.value);
            if (!validateJsonStructure(parsedData)) {
                throw new Error('Invalid JSON structure. Form will not be saved.');
            }
            jsonError.set('');
        } catch (e) {
            jsonError.set(e.message);
        }
        jsonText.set(event.target.value);
    }
</script>

<main>
    <a href="/">
        <button>Go to main page</button>
    </a>
    <button style="background-color: #2929" on:click={saveProfile}>Save</button>
    <button on:click={toggleView}>{$showJson ? 'as input' : 'as json'}</button>
    <NotificationList />

    {#if $showJson}
        <div class="textarea-container">
            <textarea
                    class="json-textarea"
                    bind:value={$jsonText}
                    on:input={handleJsonChange}></textarea>
        </div>
        {#if $jsonError}
            <p style="color: red;">{$jsonError}</p>
        {/if}
    {:else}
        <div>
            <h1>Edit Profile</h1>
            <span style="padding: 2rem">Required fields are marked with a star</span>
        </div>
        {#each Object.keys(requiredFields) as key}
            <label>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
                {#if requiredFields[key] === 'number'}
                    <input type="number" bind:value={profileData[key]} placeholder="Enter your {key}" />
                {:else}
                    <input type="text" bind:value={profileData[key]} placeholder="Enter your {key}" />
                {/if}
            </label>
        {/each}
    {/if}
</main>

<style>
    main {
        padding-left: 15vw;
    }
    input {
        display: block;
        margin-bottom: 0.5rem;
        width: 40vw;
    }
    button {
        margin-top: 1rem;
    }
    textarea {
        width: 40vw;
        height: 40vh;
    }

    .textarea-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 1rem; /* Add some margin at the bottom if needed */
        margin-top: 1rem;
    }

    .json-textarea {
        width: 60%;
        height: 400px;
        /* You can add additional styling here if needed */
    }
</style>