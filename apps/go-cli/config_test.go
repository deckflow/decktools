package main

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestMigrationEnvironment(t *testing.T) {
	shared := t.TempDir()
	t.Setenv("DECKFLOW_CONFIG_DIR", shared)
	t.Setenv("DECKTOOLS_CONFIG_DIR", filepath.Join(shared, "product"))
	t.Setenv("DECKOPS_TOKEN", "ignored")
	t.Setenv("DECKTOOLS_TOKEN", "")
	t.Setenv("DECKFLOW_TOKEN", "")
	if resolveConfigDir(t.TempDir()) != shared || environmentCredential("TOKEN", "stored") != "stored" {
		t.Fatal("product settings must not override shared storage or use legacy credentials")
	}
	t.Setenv("DECKFLOW_TOKEN", "shared")
	t.Setenv("DECKTOOLS_TOKEN", "tools")
	if environmentCredential("TOKEN", "stored") != "tools" {
		t.Fatal("product environment must win")
	}
}

func TestSaveConfigPreservesSharedFields(t *testing.T) {
	dir := t.TempDir()
	file := filepath.Join(dir, "credentials")
	if err := os.WriteFile(file, []byte(`{"custom":{"keep":true},"webhook":"keep"}`), 0o644); err != nil {
		t.Fatal(err)
	}
	t.Setenv("DECKTOOLS_TOKEN", "do-not-persist")
	c := appContext{configDir: dir, configPath: file, config: configData{Token: "stored"}}
	if err := c.saveConfig(); err != nil {
		t.Fatal(err)
	}
	raw, err := os.ReadFile(file)
	if err != nil {
		t.Fatal(err)
	}
	var data map[string]any
	if err := json.Unmarshal(raw, &data); err != nil {
		t.Fatal(err)
	}
	if data["token"] != "stored" || data["webhook"] != "keep" || data["custom"] == nil {
		t.Fatalf("shared fields changed unexpectedly: %v", data)
	}
	info, err := os.Stat(file)
	if err != nil || info.Mode().Perm() != 0o600 {
		t.Fatal("credentials must be private")
	}
}
