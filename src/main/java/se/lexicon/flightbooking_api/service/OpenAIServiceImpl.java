package se.lexicon.flightbooking_api.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.stereotype.Service;
import se.lexicon.flightbooking_api.dto.ai.FlightQueryParameters;
import se.lexicon.flightbooking_api.dto.ai.FlightRecommendationResponse;

@Service
public class OpenAIServiceImpl implements OpenAIService {

    // The assistant is deliberately restricted to Fly Orange's actual 10
    // destinations, so it never recommends a flight the site doesn't offer
    private static final String SYSTEM_PROMPT = """
            You are the Fly Orange flight assistant, a friendly travel helper for a fictional
            Dutch flight booking website.

            Fly Orange only flies from Amsterdam to these ten destinations:
            Guernsey, Heraklion, Skopje, Zurich, Budapest, Sal, San Francisco, Madrid, Istanbul, Rome.

            Guidelines:
            - Only ever recommend destinations from this exact list
            - Be friendly, concise, and enthusiastic about travel
            - If the user asks about a destination not on this list, politely explain
              that Fly Orange doesn't fly there and suggest the closest match from the list
            - Keep responses focused on flights and travel, not unrelated topics
            """;

    private final OpenAiChatModel openAiChatModel;
    private final ChatClient chatClient;

    public OpenAIServiceImpl(OpenAiChatModel openAiChatModel, ChatClient.Builder builder) {
        this.openAiChatModel = openAiChatModel;
        this.chatClient = builder.build();
    }

    // Step 1
    @Override
    public String processSimpleChatQuery(String question) {
        if (question == null || question.trim().isEmpty()) {
            throw new IllegalArgumentException("question cannot be null or empty");
        }

        try {
            return openAiChatModel.call(question);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process chat query", e);
        }
    }

    // Step 2
    @Override
    public String generateFlightRecommendation(FlightQueryParameters parameters) {
        if (parameters == null) {
            throw new IllegalArgumentException("FlightQueryParameters cannot be null");
        }

        try {
            SystemMessage systemMessage = SystemMessage.builder()
                    .text(SYSTEM_PROMPT)
                    .build();

            String userInput = String.format("""
                            Suggest a destination for a traveler with this preference:

                            Preference: %s
                            Budget: %s

                            Explain why this destination fits their preference, and give a rough
                            price expectation and one practical booking tip.
                            """,
                    parameters.preference(),
                    parameters.budget() != null ? parameters.budget() : "not specified"
            );

            UserMessage userMessage = UserMessage.builder().text(userInput).build();

            Prompt prompt = Prompt.builder()
                    .messages(systemMessage, userMessage)
                    .chatOptions(
                            OpenAiChatOptions.builder()
                                    .model("gpt-4o")
                                    .temperature(0.4)
                                    .maxTokens(600)
                                    .build()
                    )
                    .build();

            ChatResponse response = openAiChatModel.call(prompt);

            String content = response.getResult() != null
                    ? response.getResult().getOutput().getText()
                    : null;

            return (content != null && !content.isBlank())
                    ? content
                    : "Sorry, I couldn't come up with a suggestion right now.";
        } catch (Exception e) {
            throw new RuntimeException("Failed to process chat query", e);
        }
    }

    // Step 3
    @Override
    public String generateFlightRecommendationNew(FlightQueryParameters parameters) {
        if (parameters == null) {
            throw new IllegalArgumentException("FlightQueryParameters cannot be null");
        }

        try {
            ChatResponse response = chatClient.prompt()
                    .system(SYSTEM_PROMPT)
                    .user(String.format("""
                                    Suggest a destination for a traveler with this preference:

                                    Preference: %s
                                    Budget: %s

                                    Explain why this destination fits their preference, and give a rough
                                    price expectation and one practical booking tip.
                                    """,
                            parameters.preference(),
                            parameters.budget() != null ? parameters.budget() : "not specified"
                    ))
                    .options(ChatOptions.builder()
                            .model("gpt-4o")
                            .temperature(0.4)
                            .maxTokens(600))
                    .call()
                    .chatResponse();

            String content = response != null && response.getResult() != null
                    ? response.getResult().getOutput().getText()
                    : null;

            return (content != null && !content.isBlank())
                    ? content
                    : "Sorry, I couldn't come up with a suggestion right now.";
        } catch (Exception e) {
            throw new RuntimeException("Failed to process chat query", e);
        }
    }

    // Step 4
    @Override
    public FlightRecommendationResponse generateFlightRecommendationJson(FlightQueryParameters parameters) {
        if (parameters == null) {
            throw new IllegalArgumentException("FlightQueryParameters cannot be null");
        }

        try {
            BeanOutputConverter<FlightRecommendationResponse> converter =
                    new BeanOutputConverter<>(FlightRecommendationResponse.class);

            String format = converter.getFormat();

            ChatResponse response = chatClient.prompt()
                    .system(SYSTEM_PROMPT + "\n\nFormat the output as a JSON object that matches this schema:\n" + format)
                    .user(String.format("""
                                    Suggest a destination for a traveler with this preference:

                                    Preference: %s
                                    Budget: %s
                                    """,
                            parameters.preference(),
                            parameters.budget() != null ? parameters.budget() : "not specified"
                    ))
                    .options(ChatOptions.builder()
                            .model("gpt-4o")
                            .temperature(0.4)
                            .maxTokens(600)
                    )
                    .call()
                    .chatResponse();

            String content = response != null && response.getResult() != null
                    ? response.getResult().getOutput().getText()
                    : null;

            if (content == null || content.isBlank()) {
                throw new RuntimeException("AI response is empty or null");
            }

            return converter.convert(content);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JSON flight recommendation", e);
        }
    }
}